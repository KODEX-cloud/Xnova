import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const car = await prisma.car.findUnique({ where: { id } }).catch(() => null);
  if (car) {
    return NextResponse.json({
      ...car,
      images: (() => { try { return JSON.parse(car.images); } catch { return []; } })(),
      listingType: "AUTOMOBILE",
    });
  }

  const property = await prisma.property.findUnique({ where: { id } }).catch(() => null);
  if (property) {
    return NextResponse.json({
      ...property,
      images: (() => { try { return JSON.parse(property.images); } catch { return []; } })(),
      listingType: "IMMOBILIER",
    });
  }

  return NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const userId = (session.user as any).id as string;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role);
  const body = await req.json();

  const car = await prisma.car.findUnique({ where: { id }, select: { userId: true } }).catch(() => null);
  if (car) {
    if (!isAdmin && car.userId !== userId) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    const updated = await prisma.car.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  }

  const prop = await prisma.property.findUnique({ where: { id }, select: { userId: true } }).catch(() => null);
  if (prop) {
    if (!isAdmin && prop.userId !== userId) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    const updated = await prisma.property.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Introuvable" }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const type = new URL(req.url).searchParams.get("type");
  const userId = (session.user as any).id;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role);

  try {
    if (type === "AUTOMOBILE") {
      const car = await prisma.car.findUnique({ where: { id }, select: { userId: true } });
      if (!car) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      if (!isAdmin && car.userId !== userId) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
      await prisma.car.delete({ where: { id } });
    } else {
      const property = await prisma.property.findUnique({ where: { id }, select: { userId: true } });
      if (!property) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      if (!isAdmin && property.userId !== userId) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
      }
      await prisma.property.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Suppression impossible" }, { status: 400 });
  }
}
