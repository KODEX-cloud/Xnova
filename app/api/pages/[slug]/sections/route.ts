import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ sections: [] });
  let sections = [];
  try { sections = JSON.parse((page as any).sections || "[]"); } catch {}
  return NextResponse.json({ sections });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const role = (session.user as any).role;
  if (!hasPermission(role, "EDITOR")) {
    return NextResponse.json({ error: "Permission insuffisante" }, { status: 403 });
  }

  const { slug } = await params;
  const { sections } = await req.json();

  const page = await prisma.page.upsert({
    where: { slug },
    update: { sections: JSON.stringify(sections) } as any,
    create: { slug, title: slug, sections: JSON.stringify(sections) } as any,
  });

  return NextResponse.json({ ok: true, page });
}
