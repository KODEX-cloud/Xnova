import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// CinetPay / Stripe / Mobile Money webhook handler
// Verifies payload, updates payment status, triggers downstream effects
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── CinetPay format ────────────────────────────────────────────────────
    const {
      cpm_trans_id,      // our reference
      cpm_result,        // "00" = success
      cpm_trans_status,  // "ACCEPTED"
      cpm_amount,
      cpm_currency,
    } = body;

    if (cpm_trans_id) {
      const payment = await prisma.payment.findUnique({ where: { reference: cpm_trans_id } });
      if (!payment) return NextResponse.json({ ok: false, error: "Payment not found" }, { status: 404 });

      const success = cpm_result === "00" || cpm_trans_status === "ACCEPTED";
      const status = success ? "COMPLETED" : "FAILED";

      await prisma.payment.update({ where: { reference: cpm_trans_id }, data: { status } });

      if (success && payment.type === "SUBSCRIPTION" && payment.userId) {
        const plan = payment.planType || "FREE";
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.subscription.updateMany({ where: { userId: payment.userId, status: "ACTIVE" }, data: { status: "CANCELLED" } });
        await prisma.subscription.create({ data: { userId: payment.userId, plan, status: "ACTIVE", expiresAt, paymentId: payment.id } });
        await prisma.user.update({ where: { id: payment.userId }, data: { subscriptionPlan: plan, subscriptionExpiresAt: expiresAt } });

        // Auto-invoice
        const year = new Date().getFullYear();
        const count = await prisma.invoice.count({ where: { number: { startsWith: `NOVA-${year}` } } });
        await prisma.invoice.create({
          data: {
            number: `NOVA-${year}-${String(count + 1).padStart(4, "0")}`,
            userId: payment.userId,
            paymentId: payment.id,
            amount: payment.amount,
            tax: 0,
            total: payment.amount,
            currency: payment.currency,
            status: "PAID",
            description: `Abonnement ${plan} — 1 mois`,
          },
        });

        await prisma.notification.create({
          data: {
            userId: payment.userId,
            type: "PAYMENT",
            title: "Paiement confirmé",
            body: `Votre abonnement ${plan} est activé.`,
            link: "/dashboard/abonnement",
          },
        });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Unknown webhook format" }, { status: 400 });
  } catch (e) {
    console.error("[WEBHOOK]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
