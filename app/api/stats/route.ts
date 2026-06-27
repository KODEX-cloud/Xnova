import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const [
    totalCars, activeCars, soldCars,
    totalProperties, activeProperties,
    totalPosts, publishedPosts,
    totalUsers, totalMessages, unreadMessages,
    totalLeads, unreadLeads,
    recentLeads,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "ACTIVE" } }),
    prisma.car.count({ where: { status: "SOLD" } }),
    prisma.property.count(),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { isRead: false } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    cars: { total: totalCars, active: activeCars, sold: soldCars },
    properties: { total: totalProperties, active: activeProperties },
    blog: { total: totalPosts, published: publishedPosts },
    users: { total: totalUsers },
    messages: { total: totalMessages, unread: unreadMessages },
    leads: { total: totalLeads, unread: unreadLeads },
    recentLeads,
  });
}
