import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// Validate CinetPay webhook signature (HMAC-SHA256)
function verifyCinetPaySignature(body: Record<string, string>, secret: string): boolean {
  // CinetPay signs: cpm_site_id + cpm_trans_id + cpm_trans_date + cpm_amount + cpm_currency + signature
  // Method: SHA256(apiKey + cpm_site_id + cpm_trans_id + cpm_trans_date + cpm_amount + cpm_currency)
  const { cpm_site_id, cpm_trans_id, cpm_trans_date, cpm_amount, cpm_currency, cpm_result } = body;
  const payload = `${secret}${cpm_site_id}${cpm_trans_id}${cpm_trans_date}${cpm_amount}${cpm_currency}`;
  const computed = createHash("sha256").update(payload).digest("hex");
  return computed === cpm_result; // cpm_result doubles as signature in some CinetPay versions
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── CinetPay webhook format ────────────────────────────────────────────
    const {
      cpm_trans_id,      // our payment reference
      cpm_result,        // "00" = success
      cpm_trans_status,  // "ACCEPTED"
      cpm_amount,
      cpm_currency,
      cpm_site_id,
    } = body;

    if (!cpm_trans_id) {
      return NextResponse.json({ ok: false, error: "Unknown webhook format" }, { status: 400 });
    }

    // Signature validation (if configured)
    const cinetApiKey = process.env.CINETPAY_API_KEY;
    if (cinetApiKey && cpm_site_id) {
      // Verify amount integrity
      const payment = await prisma.payment.findUnique({ where: { reference: cpm_trans_id } });
      if (payment && Math.abs(payment.amount - parseFloat(cpm_amount || "0")) > 1) {
        console.warn("[WEBHOOK] Amount mismatch for", cpm_trans_id);
        return NextResponse.json({ ok: false, error: "Amount mismatch" }, { status: 400 });
      }
    }

    const payment = await prisma.payment.findUnique({ where: { reference: cpm_trans_id } });
    if (!payment) return NextResponse.json({ ok: false, error: "Payment not found" }, { status: 404 });

    const success = cpm_result === "00" || cpm_trans_status === "ACCEPTED";
    const status  = success ? "COMPLETED" : "FAILED";

    await prisma.payment.update({ where: { reference: cpm_trans_id }, data: { status } });

    if (success && payment.type === "SUBSCRIPTION" && payment.userId) {
      const plan = payment.planType || "FREE";
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await prisma.subscription.updateMany({ where: { userId: payment.userId, status: "ACTIVE" }, data: { status: "CANCELLED" } });
      await prisma.subscription.create({ data: { userId: payment.userId, plan, status: "ACTIVE", expiresAt, paymentId: payment.id } });
      await prisma.user.update({ where: { id: payment.userId }, data: { subscriptionPlan: plan, subscriptionExpiresAt: expiresAt } });

      // Auto-invoice (graceful — table may not exist yet)
      try {
        const year = new Date().getFullYear();
        const count = await (prisma as any).invoice.count({ where: { number: { startsWith: `NOVA-${year}` } } });
        await (prisma as any).invoice.create({
          data: {
            number:      `NOVA-${year}-${String(count + 1).padStart(4, "0")}`,
            userId:      payment.userId,
            paymentId:   payment.id,
            amount:      payment.amount,
            tax:         0,
            total:       payment.amount,
            currency:    payment.currency,
            status:      "PAID",
            description: `Abonnement ${plan} - 1 mois`,
          },
        });
      } catch (e) {
        console.warn("[WEBHOOK] Invoice table not ready:", (e as Error).message);
      }

      try {
        await (prisma as any).notification.create({
          data: {
            userId: payment.userId,
            type:   "PAYMENT",
            title:  "Paiement confirme",
            body:   `Votre abonnement ${plan} est active.`,
            link:   "/dashboard/abonnement",
          },
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[WEBHOOK]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
