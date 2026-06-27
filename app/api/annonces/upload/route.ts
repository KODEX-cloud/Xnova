import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "Aucun fichier recu" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: "Format non supporte (jpeg, png, webp, gif)" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Fichier trop volumineux (max 5 Mo)" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "annonces");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const name = `annonce-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, name);
    await writeFile(filePath, buffer);

    const url = `/uploads/annonces/${name}`;

    // Register in Media library
    try {
      await prisma.media.create({
        data: {
          url,
          filename: file.name,
          mimetype: file.type,
          size:     file.size,
          alt:      file.name,
          folder:   "annonces",
        },
      });
    } catch {}

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l upload" }, { status: 500 });
  }
}