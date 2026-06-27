import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewLeadNotification } from "@/lib/email";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(getRateLimitKey(req, "contact"), 5, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de messages. Réessayez dans 1 minute." }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    const msg = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    // Notify admin by email (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (adminEmail) {
      sendNewLeadNotification(adminEmail, name, email, message).catch(() => {});
    }

    return NextResponse.json(msg, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id, isRead } = await req.json();
  const msg = await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  return NextResponse.json(msg);
}
