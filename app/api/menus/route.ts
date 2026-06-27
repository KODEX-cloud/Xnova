import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({ orderBy: [{ parentId: "asc" }, { order: "asc" }] });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/menus]", err);
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
    const item = await prisma.menuItem.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("[POST /api/menus]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
