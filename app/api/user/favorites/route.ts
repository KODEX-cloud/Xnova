import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id;
  const favs = await prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(favs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id;
  const { type, itemId } = await req.json();
  if (!type || !itemId) return NextResponse.json({ error: "type et itemId requis" }, { status: 400 });
  const existing = await prisma.favorite.findUnique({ where: { userId_type_itemId: { userId, type, itemId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ added: false });
  }
  await prisma.favorite.create({ data: { userId, type, itemId } });
  return NextResponse.json({ added: true });
}
