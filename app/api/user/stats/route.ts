import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });

  const userId = (session.user as any).id as string;

  const [cars, properties] = await prisma.$transaction([
    prisma.car.findMany({ where: { userId }, select: { status: true } }),
    prisma.property.findMany({ where: { userId }, select: { status: true } }),
  ]);

  // Graceful degradation: these tables may not exist in prod yet (migration pending)
  let totalMessages = 0;
  try {
    totalMessages = await (prisma as any).message.count({ where: { receiverId: userId } });
  } catch {}

  const allListings = [...cars, ...properties];

  return NextResponse.json({
    totalListings: allListings.length,
    activeListings: allListings.filter(l => l.status === "ACTIVE").length,
    totalViews: 0,
    totalFavorites: 0,
    totalMessages,
    listingsByType: {
      cars: cars.length,
      properties: properties.length,
    },
  });
}
