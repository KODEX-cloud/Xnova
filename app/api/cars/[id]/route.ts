import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!car) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await prisma.car.update({ where: { id: car.id }, data: { views: { increment: 1 } } }).catch(() => {});
  return NextResponse.json({ ...car, images: (() => { try { return JSON.parse(car.images); } catch { return []; } })() });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { images, ...rest } = body;
    const car = await prisma.car.update({
      where: { id },
      data: { ...rest, ...(images !== undefined && { images: JSON.stringify(images) }) },
    });
    return NextResponse.json(car);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ success: true });
}