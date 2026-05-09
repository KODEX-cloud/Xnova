import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });
  if (!post) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  return NextResponse.json({ ...post, tags: (() => { try { return JSON.parse(post.tags); } catch { return []; } })() });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { tags, ...rest } = body;
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(body.status === "PUBLISHED" && !body.publishedAt && { publishedAt: new Date() }),
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
