import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePaymentRef } from "@/lib/plans";

export const dynamic = "force-dynamic";

// GET — list payments (admin: all, user: own)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page  = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip  = (page - 1) * limit;

  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role);
  const where   = isAdmin ? {} : { userId: (session.user as any).id };

  const statusFilter = searchParams.get("status");
  const finalWhere   = statusFilter ? { ...where, status: statusFilter } : where;

  const [payments, total, agg] = await prisma.$transaction([
    prisma.payment.findMany({
      where: finalWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.payment.count({ where: finalWhere }),
    prisma.payment.aggregate({ where: { ...where, status: "COMPLETED" }, _sum: { amount: true } }),
  ]);

  return NextResponse.json({ payments, total, totalAmount: agg._sum.amount ?? 0, page, pages: Math.ceil(total / limit) });
}

// POST — create a payment and activate the service
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as any).id as string;

  try {
    const body = await req.json();
    const { amount, method, type, planType, relatedId, phone } = body;

    if (!amount || !method || !type) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const reference = generatePaymentRef();

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount:    parseFloat(String(amount)),
        method,
        status:    "COMPLETED",
        reference,
        type,
        planType,
        relatedId,
        phone,
      },
    });

    // ── Activate the purchased service ──────────────────────────────────────

    if (type === "SUBSCRIPTION") {
      const daysMap: Record<string, number> = { FREE: 30, PRO: 30, PREMIUM: 30 };
      const days = daysMap[planType || "FREE"] ?? 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      // Cancel existing active subscriptions
      await prisma.subscription.updateMany({
        where: { userId, status: "ACTIVE" },
        data:  { status: "CANCELLED" },
      });

      await prisma.subscription.create({
        data: { userId, plan: planType || "FREE", status: "ACTIVE", expiresAt, paymentId: payment.id },
      });

      await prisma.user.update({
        where: { id: userId },
        data:  { subscriptionPlan: planType || "FREE", subscriptionExpiresAt: expiresAt },
      });
    }

    if (type === "BOOST" && relatedId) {
      const boostDays = planType === "PREMIUM" ? 60 : 30;
      const boostedUntil = new Date();
      boostedUntil.setDate(boostedUntil.getDate() + boostDays);

      // Try Car first, then Property
      const car = await prisma.car.findUnique({ where: { id: relatedId } });
      if (car) {
        await prisma.car.update({
          where: { id: relatedId },
          data:  { planType: planType || "EN_AVANT", isBoosted: true, boostedUntil, badge: planType || "EN_AVANT", status: "ACTIVE" },
        });
      } else {
        await prisma.property.update({
          where: { id: relatedId },
          data:  { planType: planType || "EN_AVANT", isBoosted: true, boostedUntil, badge: planType || "EN_AVANT", status: "ACTIVE" },
        });
      }
    }

    if (type === "ANNONCE" && relatedId) {
      const boostedUntil = planType !== "GRATUIT" ? (() => { const d = new Date(); d.setDate(d.getDate() + (planType === "PREMIUM" ? 60 : 30)); return d; })() : undefined;
      const car = await prisma.car.findUnique({ where: { id: relatedId } });
      if (car) {
        await prisma.car.update({
          where: { id: relatedId },
          data:  { planType: planType || "GRATUIT", isBoosted: planType !== "GRATUIT", boostedUntil, status: "ACTIVE", publishedAt: new Date() },
        });
      } else {
        await prisma.property.update({
          where: { id: relatedId },
          data:  { planType: planType || "GRATUIT", isBoosted: planType !== "GRATUIT", boostedUntil, status: "ACTIVE", publishedAt: new Date() },
        });
      }
    }

    // Auto-generate invoice for completed payments
    if (type === "SUBSCRIPTION") {
      const year = new Date().getFullYear();
      const invoiceCount = await prisma.invoice.count({ where: { number: { startsWith: `NOVA-${year}` } } });
      await prisma.invoice.create({
        data: {
          number:      `NOVA-${year}-${String(invoiceCount + 1).padStart(4, "0")}`,
          userId,
          paymentId:   payment.id,
          amount:      parseFloat(String(amount)),
          tax:         0,
          total:       parseFloat(String(amount)),
          currency:    "FCFA",
          status:      "PAID",
          description: `Abonnement ${planType || "FREE"} — 1 mois`,
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          type:  "PAYMENT",
          title: "Paiement confirmé",
          body:  `Votre abonnement ${planType || "FREE"} est activé. Bonne continuation !`,
          link:  "/dashboard/abonnement",
        },
      });
    }

    return NextResponse.json({ ok: true, payment, reference });
  } catch (e) {
    console.error("[PAYMENTS POST]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
