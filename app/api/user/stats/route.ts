import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as any).id as string;

  const [cars, properties, favorites, messages] = await prisma.$transaction([
    prisma.car.findMany({ where: { userId }, select: { status: true } }),
    prisma.property.findMany({ where: { userId }, select: { status: true } }),
    prisma.favorite.count({ where: { itemId: { in: [] } } }), // placeholder
    prisma.message.count({ where: { receiverId: userId } }),
  ]);

  const allListings = [...cars, ...properties];

  return NextResponse.json({
    totalListings: allListings.length,
    activeListings: allListings.filter(l => l.status === "ACTIVE").length,
    totalViews: 0, // requires view tracking table
    totalFavorites: 0, // requires join on itemId
    totalMessages: messages,
    listingsByType: {
      cars: cars.length,
      properties: properties.length,
    },
  });
}
