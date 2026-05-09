import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-")
    + "-" + Date.now();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PUBLISHED";
    const all = searchParams.get("all");
    const category = searchParams.get("category");
    const categories = searchParams.get("categories");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = all === "true" ? {} : { status };
    if (categories) where.category = { in: categories.split(",").map((c: string) => c.trim()) };
    else if (category) where.category = category;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[GET /api/blog]", err);
    return NextResponse.json({ posts: [], total: 0, page: 1, pages: 1 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { tags, ...rest } = body;
    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        slug: slugify(body.title),
        tags: JSON.stringify(tags || []),
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("[POST /api/blog]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
