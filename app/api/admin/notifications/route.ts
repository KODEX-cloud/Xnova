import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const notifs = await (prisma as any).notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json(notifs);
    }

    const counts = await (prisma as any).notification.groupBy({
      by: ["userId"],
      _count: { id: true },
      where: { isRead: false },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    return NextResponse.json(counts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  const { type, title, body, link, userIds, broadcast } = await req.json();
  if (!title || !type) return NextResponse.json({ error: "title et type requis" }, { status: 400 });

  let targetIds: string[] = userIds ?? [];

  if (broadcast) {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
      take: 5000,
    });
    targetIds = users.map((u: any) => u.id);
  }

  if (targetIds.length === 0) return NextResponse.json({ error: "Aucun destinataire" }, { status: 400 });

  try {
    await (prisma as any).notification.createMany({
      data: targetIds.map((userId: string) => ({ userId, type, title, body: body ?? null, link: link ?? null })),
    });
    return NextResponse.json({ sent: targetIds.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Service notifications non disponible" }, { status: 503 });
  }
}