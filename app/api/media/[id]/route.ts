import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink, writeFile } from "fs/promises";
import path from "path";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (media.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", media.url);
    try { await unlink(filePath); } catch {}
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporté (jpeg, png, webp, gif)" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Overwrite the file at the exact same location
    const filePath = path.join(process.cwd(), "public", media.url);
    await writeFile(filePath, buffer);

    // Update metadata in database
    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        filename: file.name,
        mimetype: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ success: true, media: updatedMedia });
  } catch {
    return NextResponse.json({ error: "Erreur lors du remplacement du média" }, { status: 500 });
  }
}

