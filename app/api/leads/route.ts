import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!hasPermission((session.user as any).role, "AGENT_AUTO")) {
    return NextResponse.json({ error: "Permission insuffisante" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type");
  const isRead = searchParams.get("isRead");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type;
  if (isRead !== null && isRead !== "") where.isRead = isRead === "true";

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type = "CONTACT", name, email, phone, subject, message, source, listingType, listingId } = body;

  if (!name || !message) {
    return NextResponse.json({ error: "Nom et message requis" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { type, name, email, phone, subject, message, source, listingType, listingId },
  });

  return NextResponse.json(lead, { status: 201 });
}
