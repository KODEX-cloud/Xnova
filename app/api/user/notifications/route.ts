import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  try {
    if (unreadOnly) {
      const count = await (prisma as any).notification.count({ where: { userId, isRead: false } });
      return NextResponse.json({ count });
    }
    const notifications = await (prisma as any).notification.findMany({
      where:   { userId },
      orderBy: { createdAt: "desc" },
      take:    50,
    });
    return NextResponse.json(notifications);
  } catch {
    // Table not migrated yet
    if (unreadOnly) return NextResponse.json({ count: 0 });
    return NextResponse.json([]);
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const userId = (session.user as any).id;
  const { ids } = await req.json().catch(() => ({ ids: null }));
  try {
    await (prisma as any).notification.updateMany({
      where: { userId, ...(ids ? { id: { in: ids } } : {}) },
      data:  { isRead: true },
    });
  } catch {}
  return NextResponse.json({ ok: true });
}
