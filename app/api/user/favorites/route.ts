import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const userId = (session.user as any).id;
  try {
    const favs = await (prisma as any).favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(favs);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  const userId = (session.user as any).id;
  const { type, itemId } = await req.json();
  if (!type || !itemId) return NextResponse.json({ error: "type et itemId requis" }, { status: 400 });
  try {
    const existing = await (prisma as any).favorite.findUnique({ where: { userId_type_itemId: { userId, type, itemId } } });
    if (existing) {
      await (prisma as any).favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ added: false });
    }
    await (prisma as any).favorite.create({ data: { userId, type, itemId } });
    return NextResponse.json({ added: true });
  } catch {
    return NextResponse.json({ error: "Service favoris pas encore disponible" }, { status: 503 });
  }
}
