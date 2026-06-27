import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg":       "image",
  "image/jpg":        "image",
  "image/png":        "image",
  "image/webp":       "image",
  "image/gif":        "image",
  "image/avif":       "image",
  "video/mp4":        "video",
  "video/webm":       "video",
  "video/quicktime":  "video",
  "application/pdf":  "document",
};

const MAX_SIZES: Record<string, number> = {
  image:    10 * 1024 * 1024,  // 10 MB
  video:    200 * 1024 * 1024, // 200 MB
  document: 20 * 1024 * 1024,  // 20 MB
};

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AGENT_AUTO", "AGENT_IMMO"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File;
    const folder   = (formData.get("folder") as string) || "general";
    const alt      = (formData.get("alt") as string) || "";

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

    const fileClass = ALLOWED_TYPES[file.type];
    if (!fileClass) return NextResponse.json({ error: `Format non supporté: ${file.type}` }, { status: 400 });

    const maxSize = MAX_SIZES[fileClass];
    if (file.size > maxSize) {
      return NextResponse.json({ error: `Fichier trop volumineux (max ${maxSize / 1024 / 1024} Mo)` }, { status: 400 });
    }

    const bytes     = await file.arrayBuffer();
    const buffer    = Buffer.from(bytes);
    const ext       = file.name.split(".").pop()?.toLowerCase() || file.type.split("/")[1] || "bin";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir  = path.join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    const url = `/uploads/${folder}/${uniqueName}`;

    const media = await prisma.media.create({
      data: {
        url,
        filename: file.name,
        mimetype: file.type,
        size:     file.size,
        alt:      alt || file.name,
        folder,
      },
    });

    return NextResponse.json({ url, media });
  } catch (e) {
    console.error("[UPLOAD]", e);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
