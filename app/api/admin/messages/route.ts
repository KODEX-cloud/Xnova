import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const adminId = (session.user as any).id;

  try {
    if (userId) {
      const messages = await (prisma as any).message.findMany({
        where: {
          OR: [
            { senderId: adminId, receiverId: userId },
            { senderId: userId, receiverId: adminId },
          ],
        },
        include: {
          sender:   { select: { id: true, name: true, avatar: true, email: true } },
          receiver: { select: { id: true, name: true, avatar: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      });
      await (prisma as any).message.updateMany({
        where: { senderId: userId, receiverId: adminId, isRead: false },
        data:  { isRead: true },
      });
      return NextResponse.json(messages);
    }

    const msgs = await (prisma as any).message.findMany({
      where: { OR: [{ senderId: adminId }, { receiverId: adminId }] },
      include: {
        sender:   { select: { id: true, name: true, avatar: true, email: true } },
        receiver: { select: { id: true, name: true, avatar: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const seen = new Map<string, any>();
    msgs.forEach((m: any) => {
      const partnerId = m.senderId === adminId ? m.receiverId : m.senderId;
      if (!seen.has(partnerId)) seen.set(partnerId, m);
    });

    return NextResponse.json(Array.from(seen.values()));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  const adminId = (session.user as any).id;
  const adminName = (session.user as any).name || "L equipe NOVA";
  const { receiverId, body, subject, threadId } = await req.json();
  if (!receiverId || !body) return NextResponse.json({ error: "receiverId et body requis" }, { status: 400 });

  try {
    const msg = await (prisma as any).message.create({
      data: { senderId: adminId, receiverId, body, subject, threadId },
    });

    try {
      await (prisma as any).notification.create({
        data: {
          userId: receiverId,
          type:   "MESSAGE",
          title:  "Message de NOVA",
          body:   `${adminName}: ${body.slice(0, 80)}`,
          link:   "/dashboard/messages",
        },
      });
    } catch {}

    return NextResponse.json(msg, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Service messages non disponible" }, { status: 503 });
  }
}