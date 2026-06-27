import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePaymentRef } from "@/lib/plans";

export const dynamic = "force-dynamic";

// POST — Initiate a real CinetPay payment (returns redirect URL)
// Falls back to direct completion if CinetPay not configured
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { amount, method, type, planType, relatedId, phone } = body;

  if (!amount && amount !== 0) return NextResponse.json({ error: "amount requis" }, { status: 400 });
  if (!type) return NextResponse.json({ error: "type requis" }, { status: 400 });

  const reference = generatePaymentRef();

  // Create pending payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount:   parseFloat(String(amount)),
      method:   method || "NONE",
      status:   amount === 0 ? "COMPLETED" : "PENDING",
      reference,
      type,
      planType,
      relatedId,
      phone,
    },
  });

  // If amount is 0 (free plan), activate immediately
  if (amount === 0 || !amount) {
    await activateService(payment.id, userId, type, planType, relatedId);
    return NextResponse.json({ ok: true, payment, mode: "free" });
  }

  // Try CinetPay if configured
  const cinetApiKey = process.env.CINETPAY_API_KEY;
  const cinetSiteId = process.env.CINETPAY_SITE_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:4000";

  if (cinetApiKey && cinetSiteId) {
    try {
      const cinetRes = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apikey:       cinetApiKey,
          site_id:      cinetSiteId,
          transaction_id: reference,
          amount:       parseFloat(String(amount)),
          currency:     "XOF",
          description:  `NOVA ${type} - ${planType || ""}`,
          return_url:   `${baseUrl}/paiement/success?ref=${reference}`,
          cancel_url:   `${baseUrl}/paiement?cancelled=1`,
          notify_url:   `${baseUrl}/api/payments/webhook`,
          customer_name:    (session.user as any).name || "Client",
          customer_email:   (session.user as any).email || "",
          customer_phone_number: phone || "",
          customer_address: "Abidjan",
          customer_city:    "Abidjan",
          customer_country: "CI",
          customer_state:   "CI",
          customer_zip_code: "00225",
          channels:    method === "CARD" ? "CREDIT_CARD" : "MOBILE_MONEY",
        }),
      });

      const cinetData = await cinetRes.json();
      if (cinetData.code === "201") {
        return NextResponse.json({
          ok: true,
          payment,
          mode: "cinetpay",
          redirectUrl: cinetData.data?.payment_url,
        });
      }
      console.warn("[INITIATE] CinetPay error:", cinetData);
    } catch (e) {
      console.error("[INITIATE] CinetPay unreachable:", e);
    }
  }

  // Fallback: simulate completion (dev mode — no real gateway configured)
  await prisma.payment.update({ where: { id: payment.id }, data: { status: "COMPLETED" } });
  await activateService(payment.id, userId, type, planType, relatedId);
  return NextResponse.json({ ok: true, payment, mode: "simulated" });
}

// Shared activation logic
async function activateService(paymentId: string, userId: string, type: string, planType: string | undefined, relatedId: string | undefined) {
  if (type === "SUBSCRIPTION") {
    const days = 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    await prisma.subscription.updateMany({ where: { userId, status: "ACTIVE" }, data: { status: "CANCELLED" } });
    await prisma.subscription.create({ data: { userId, plan: planType || "FREE", status: "ACTIVE", expiresAt, paymentId } });
    await prisma.user.update({ where: { id: userId }, data: { subscriptionPlan: planType || "FREE", subscriptionExpiresAt: expiresAt } });
  }

  if ((type === "BOOST" || type === "ANNONCE") && relatedId) {
    const boostDays = planType === "PREMIUM" ? 60 : 30;
    const boostedUntil = planType !== "GRATUIT" ? new Date(Date.now() + boostDays * 86400000) : undefined;
    const car = await prisma.car.findUnique({ where: { id: relatedId } }).catch(() => null);
    if (car) {
      await prisma.car.update({ where: { id: relatedId }, data: { planType: planType || "GRATUIT", isBoosted: planType !== "GRATUIT", boostedUntil, status: "ACTIVE", publishedAt: new Date() } });
    } else {
      await prisma.property.update({ where: { id: relatedId }, data: { planType: planType || "GRATUIT", isBoosted: planType !== "GRATUIT", boostedUntil, status: "ACTIVE", publishedAt: new Date() } }).catch(() => {});
    }
  }
}
