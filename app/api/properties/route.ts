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
    const featured = searchParams.get("featured");
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const priceType = searchParams.get("priceType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const types = searchParams.get("types"); // comma-separated: VILLA,HOUSE,APARTMENT

    const where: any = { status: "ACTIVE" };
    if (featured === "true") where.featured = true;
    if (types) where.type = { in: types.split(",").map(t => t.trim()) };
    else if (type) where.type = type;
    if (city) where.city = { contains: city };
    if (priceType) where.priceType = priceType;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { images, amenities, ...rest } = body;
    const property = await prisma.property.create({
      data: {
        ...rest,
        slug: slugify(body.title),
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
      },
    });
    return NextResponse.json(property, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
