import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalCars, activeCars, soldCars,
    totalProperties, activeProperties,
    totalPosts, publishedPosts,
    totalUsers, newUsersThisMonth, newUsersLastMonth,
    totalMessages, unreadMessages,
    totalLeads, unreadLeads,
    recentLeads,
    totalRevenue, revenueThisMonth, revenueLastMonth,
    activeSubs, subsByPlan,
    pendingListings,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "ACTIVE" } }),
    prisma.car.count({ where: { status: "SOLD" } }),
    prisma.property.count(),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { isRead: false } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      include: { assignedTo: { select: { name: true } } },
    }),
    prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "COMPLETED", createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "COMPLETED", createdAt: { gte: startOfLastMonth, lt: startOfMonth } }, _sum: { amount: true } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.groupBy({ by: ["plan"], _count: { id: true }, where: { status: "ACTIVE" } }),
    prisma.car.count({ where: { status: "PENDING" } }).then(c => prisma.property.count({ where: { status: "PENDING" } }).then(p => c + p)),
  ]);

  // Tables that may not be migrated yet — graceful degradation
  let totalNotifications = 0, unreadNotifications = 0;
  try {
    [totalNotifications, unreadNotifications] = await Promise.all([
      (prisma as any).notification.count(),
      (prisma as any).notification.count({ where: { isRead: false } }),
    ]);
  } catch {}

  const revMonth = revenueThisMonth._sum.amount ?? 0;
  const revLastMonth = revenueLastMonth._sum.amount ?? 0;
  const revTrend = revLastMonth > 0 ? Math.round(((revMonth - revLastMonth) / revLastMonth) * 100) : 0;

  const userTrend = newUsersLastMonth > 0
    ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
    : 0;

  return NextResponse.json({
    cars:        { total: totalCars, active: activeCars, sold: soldCars },
    properties:  { total: totalProperties, active: activeProperties },
    blog:        { total: totalPosts, published: publishedPosts },
    users:       { total: totalUsers, newThisMonth: newUsersThisMonth, trend: userTrend },
    messages:    { total: totalMessages, unread: unreadMessages },
    leads:       { total: totalLeads, unread: unreadLeads },
    recentLeads,
    revenue:     { total: totalRevenue._sum.amount ?? 0, thisMonth: revMonth, trend: revTrend },
    subscriptions: { active: activeSubs, byPlan: subsByPlan },
    pending:     pendingListings,
    notifications: { total: totalNotifications, unread: unreadNotifications },
  });
}