import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!car) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await prisma.car.update({ where: { id: car.id }, data: { views: { increment: 1 } } });
  return NextResponse.json({ ...car, images: JSON.parse(car.images) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
