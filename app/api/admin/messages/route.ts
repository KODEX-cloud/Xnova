import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // view conversation with specific user
  const adminId = (session.user as any).id;

  if (userId) {
    const messages = await prisma.message.findMany({
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
    // Mark received as read
    await prisma.message.updateMany({
      where: { senderId: userId, receiverId: adminId, isRead: false },
      data:  { isRead: true },
    });
    return NextResponse.json(messages);
  }

  // List all conversations (unique users who messaged admin or were messaged by admin)
  const msgs = await prisma.message.findMany({
    where: { OR: [{ senderId: adminId }, { receiverId: adminId }] },
    include: {
      sender:   { select: { id: true, name: true, avatar: true, email: true } },
      receiver: { select: { id: true, name: true, avatar: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Group by conversation partner
  const seen = new Map<string, typeof msgs[0]>();
  msgs.forEach(m => {
    const partnerId = m.senderId === adminId ? m.receiverId : m.senderId;
    if (!seen.has(partnerId)) seen.set(partnerId, m);
  });

  return NextResponse.json(Array.from(seen.values()));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const adminId = (session.user as any).id;
  const adminName = (session.user as any).name || "L'équipe NOVA";
  const { receiverId, body, subject, threadId } = await req.json();
  if (!receiverId || !body) return NextResponse.json({ error: "receiverId et body requis" }, { status: 400 });

  const msg = await prisma.message.create({
    data: { senderId: adminId, receiverId, body, subject, threadId },
  });

  await prisma.notification.create({
    data: {
      userId: receiverId,
      type:   "MESSAGE",
      title:  "Message de NOVA",
      body:   `${adminName}: ${body.slice(0, 80)}`,
      link:   "/dashboard/messages",
    },
  });

  return NextResponse.json(msg, { status: 201 });
}
