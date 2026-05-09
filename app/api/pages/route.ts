import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const slug = new URL(req.url).searchParams.get("slug");
    if (slug) {
      const page = await prisma.page.findUnique({ where: { slug } });
      if (!page) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
      return NextResponse.json(page);
    }
    const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
    return NextResponse.json(pages);
  } catch (err) {
    console.error("[GET /api/pages]", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, ...data } = body;

    const page = await prisma.page.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });

    return NextResponse.json(page);
  } catch (err) {
    console.error("[PUT /api/pages]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
