import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prop = await prisma.property.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!prop) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await prisma.property.update({ where: { id: prop.id }, data: { views: { increment: 1 } } });
  return NextResponse.json({
    ...prop,
    images: (() => { try { return JSON.parse(prop.images); } catch { return []; } })(),
    amenities: (() => { try { return JSON.parse(prop.amenities); } catch { return []; } })(),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { images, amenities, ...rest } = body;
  const prop = await prisma.property.update({
    where: { id },
    data: {
      ...rest,
      ...(images !== undefined && { images: JSON.stringify(images) }),
      ...(amenities !== undefined && { amenities: JSON.stringify(amenities) }),
    },
  });
  return NextResponse.json(prop);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
