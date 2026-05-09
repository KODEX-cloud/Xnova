import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    + "-" + Date.now();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const brand = searchParams.get("brand");
    const priceType = searchParams.get("priceType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (featured === "true") where.featured = true;
    if (status) where.status = status;
    else where.status = "ACTIVE";
    if (city) where.city = { contains: city };
    if (brand) where.brand = { contains: brand };
    if (priceType) where.priceType = priceType;

    const [cars, total] = await Promise.all([
      prisma.car.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({ cars, total, page, pages: Math.ceil(total / limit) });
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
    const { images, ...rest } = body;

    const car = await prisma.car.create({
      data: {
        ...rest,
        slug: slugify(body.title),
        images: JSON.stringify(images || []),
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
