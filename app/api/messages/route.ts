import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  const unreadOnly = searchParams.get("unread") === "true";
  if (unreadOnly) {
    const count = await prisma.message.count({ where: { receiverId: userId, isRead: false } });
    return NextResponse.json({ count });
  }
  const messages = await prisma.message.findMany({
    where: threadId
      ? { threadId }
      : { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, avatar: true, email: true } },
      receiver: { select: { id: true, name: true, avatar: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  await prisma.message.updateMany({
    where: { receiverId: userId, isRead: false, ...(threadId ? { threadId } : {}) },
    data: { isRead: true },
  });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const senderId = (session.user as any).id;
  const { receiverId, body, subject, threadId, attachment } = await req.json();
  if (!receiverId || !body) return NextResponse.json({ error: "receiverId et body requis" }, { status: 400 });
  const msg = await prisma.message.create({
    data: { senderId, receiverId, body, subject, threadId, attachment },
  });
  await prisma.notification.create({
    data: { userId: receiverId, type: "MESSAGE", title: "Nouveau message", body: `De ${(session.user as any).name || "NOVA"}`, link: "/dashboard/messages" },
  });
  return NextResponse.json(msg, { status: 201 });
}
