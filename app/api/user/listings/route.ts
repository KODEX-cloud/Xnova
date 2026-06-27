import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as any).id as string;

  const [cars, properties, user] = await prisma.$transaction([
    prisma.car.findMany({
      where:   { userId },
      orderBy: { createdAt: "desc" },
      select:  { id: true, title: true, price: true, priceType: true, status: true, planType: true, isBoosted: true, boostedUntil: true, city: true, images: true, createdAt: true, views: true },
    }),
    prisma.property.findMany({
      where:   { userId },
      orderBy: { createdAt: "desc" },
      select:  { id: true, title: true, price: true, priceType: true, status: true, planType: true, isBoosted: true, boostedUntil: true, city: true, images: true, createdAt: true, views: true },
    }),
    prisma.user.findUnique({
      where:  { id: userId },
      select: { subscriptionPlan: true },
    }),
  ]);

  const plan = getPlan((user?.subscriptionPlan ?? "FREE") as any);
  const total = cars.length + properties.length;
  const canPublishMore = plan.limits.maxListings === -1 || total < plan.limits.maxListings;

  const listings = [
    ...cars.map((c) => ({ ...c, type: "AUTOMOBILE" as const })),
    ...properties.map((p) => ({ ...p, type: "IMMOBILIER" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    listings,
    stats: {
      total,
      active:  listings.filter((l) => l.status === "ACTIVE").length,
      pending: listings.filter((l) => l.status === "PENDING").length,
      expired: listings.filter((l) => l.status === "EXPIRED").length,
    },
    plan: user?.subscriptionPlan ?? "FREE",
    canPublishMore,
    maxListings: plan.limits.maxListings,
  });
}
