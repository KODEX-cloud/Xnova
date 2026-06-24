import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;
  if (!userRole || !["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(userRole)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { question, answer, category = "Général", order = 0 } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: "question et answer requis" }, { status: 400 });
    }
    const item = await prisma.faqItem.create({
      data: { question, answer, category, order, isActive: true },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
