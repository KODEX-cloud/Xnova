import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — current user's active subscription
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId  = (session.user as any).id as string;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role);

  if (isAdmin) {
    // Admin: return all subscriptions with pagination
    const subs = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user:    { select: { id: true, name: true, email: true, phone: true } },
        payment: { select: { reference: true, amount: true } },
      },
    });
    return NextResponse.json(subs);
  }

  // Regular user: return own subscription + usage
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, subscriptionExpiresAt: true },
  });

  const subscription = await prisma.subscription.findFirst({
    where:   { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const [carCount, propertyCount] = await prisma.$transaction([
    prisma.car.count({ where: { userId, status: { not: "EXPIRED" } } }),
    prisma.property.count({ where: { userId, status: { not: "EXPIRED" } } }),
  ]);

  return NextResponse.json({
    plan:          user?.subscriptionPlan ?? "FREE",
    expiresAt:     user?.subscriptionExpiresAt ?? null,
    subscription,
    usage:         { listings: carCount + propertyCount },
  });
}
