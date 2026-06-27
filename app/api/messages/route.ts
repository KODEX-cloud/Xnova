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
  const threadId = searchParams.get("threadId");
  const unreadOnly = searchParams.get("unread") === "true";

  try {
    if (unreadOnly) {
      const count = await (prisma as any).message.count({ where: { receiverId: userId, isRead: false } });
      return NextResponse.json({ count });
    }
    const messages = await (prisma as any).message.findMany({
      where: threadId
        ? { threadId }
        : { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender:   { select: { id: true, name: true, avatar: true, email: true } },
        receiver: { select: { id: true, name: true, avatar: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    await (prisma as any).message.updateMany({
      where: { receiverId: userId, isRead: false, ...(threadId ? { threadId } : {}) },
      data: { isRead: true },
    }).catch(() => {});
    return NextResponse.json(messages);
  } catch {
    // Table not migrated yet — return graceful empty response
    if (unreadOnly) return NextResponse.json({ count: 0 });
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const senderId = (session.user as any).id;
  const { receiverId, body, subject, threadId, attachment } = await req.json();
  if (!receiverId || !body) return NextResponse.json({ error: "receiverId et body requis" }, { status: 400 });

  try {
    const msg = await (prisma as any).message.create({
      data: { senderId, receiverId, body, subject, threadId, attachment },
    });
    // Notification is optional — table may not exist yet
    try {
      await (prisma as any).notification.create({
        data: { userId: receiverId, type: "MESSAGE", title: "Nouveau message", body: `De ${(session.user as any).name || "NOVA"}`, link: "/dashboard/messages" },
      });
    } catch {}
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    console.warn("[MESSAGES POST] Table not ready:", (e as Error).message);
    return NextResponse.json({ error: "Service de messagerie pas encore disponible" }, { status: 503 });
  }
}
