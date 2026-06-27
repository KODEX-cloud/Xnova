import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const all = new URL(req.url).searchParams.get("all");
    const where = all === "true" ? {} : { isActive: true };
    const promos = await prisma.promotion.findMany({ where, orderBy: { order: "asc" } });
    return NextResponse.json(promos);
  } catch (err) {
    console.error("[GET /api/promotions]", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await req.json();
    const promo = await prisma.promotion.create({ data: body });
    return NextResponse.json(promo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/promotions]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
