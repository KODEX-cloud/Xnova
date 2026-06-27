import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AGENT_AUTO", "AGENT_IMMO"];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page   = parseInt(searchParams.get("page") || "1");
  const limit  = parseInt(searchParams.get("limit") || "48");
  const search = searchParams.get("search") || "";
  const type   = searchParams.get("type") || ""; // image | video | document | all
  const folder = searchParams.get("folder") || "";

  const where: any = {};
  if (search) where.filename = { contains: search, mode: "insensitive" };
  if (folder) where.folder = folder;
  if (type === "image")    where.mimetype = { startsWith: "image/" };
  if (type === "video")    where.mimetype = { startsWith: "video/" };
  if (type === "document") where.mimetype = "application/pdf";

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({ media, total, page, pages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { ids } = await req.json() as { ids: string[] };
  if (!ids?.length) return NextResponse.json({ error: "IDs requis" }, { status: 400 });

  // Note: physical file deletion would require fs.unlink — omitted for safety
  // The DB record is removed; the file remains on disk (cleanup job can handle)
  await prisma.media.deleteMany({ where: { id: { in: ids } } });

  return NextResponse.json({ deleted: ids.length });
}
