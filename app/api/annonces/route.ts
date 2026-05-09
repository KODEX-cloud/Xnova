import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ── GET — unified listings (cars + properties) with advanced filtering ──────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const kind      = searchParams.get("kind")     || "ALL";   // ALL | AUTO | IMMO
    const city      = searchParams.get("city")     || "";
    const sort      = searchParams.get("sort")     || "recent"; // recent | price_asc | price_desc | boost
    const priceMin  = parseInt(searchParams.get("priceMin") || "0");
    const priceMax  = parseInt(searchParams.get("priceMax") || "999999999");
    const priceType = searchParams.get("priceType") || "";
    const category  = searchParams.get("category") || "";
    const page      = parseInt(searchParams.get("page") || "1");
    const limit     = parseInt(searchParams.get("limit") || "24");
    const skip      = (page - 1) * limit;

    const orderBy = sort === "price_asc"  ? { price: "asc"  as const }
                  : sort === "price_desc" ? { price: "desc" as const }
                  : sort === "boost"      ? { isBoosted: "desc" as const }
                  : { createdAt: "desc"  as const };

    const statusFilter = searchParams.get("status") || "";
    const baseWhere: any = {
      ...(statusFilter ? { status: statusFilter } : { status: "ACTIVE" }),
      price:  { gte: isNaN(priceMin) ? 0 : priceMin, lte: isNaN(priceMax) ? 999999999 : priceMax },
      ...(city      ? { city: { contains: city } } : {}),
      ...(priceType ? { priceType }                : {}),
    };

    let cars: any[]       = [];
    let properties: any[] = [];
    let totalCars  = 0;
    let totalProps = 0;

    if (kind === "ALL" || kind === "AUTO") {
      const w = { ...baseWhere, ...(category ? { category } : {}) };
      [cars, totalCars] = await Promise.all([
        prisma.car.findMany({ where: w, orderBy, skip: kind === "AUTO" ? skip : 0, take: kind === "AUTO" ? limit : limit }),
        prisma.car.count({ where: w }),
      ]);
    }

    if (kind === "ALL" || kind === "IMMO") {
      const w = { ...baseWhere, ...(category ? { type: category } : {}) };
      [properties, totalProps] = await Promise.all([
        prisma.property.findMany({ where: w, orderBy, skip: kind === "IMMO" ? skip : 0, take: kind === "IMMO" ? limit : limit }),
        prisma.property.count({ where: w }),
      ]);
    }

    const listings = [
      ...cars.map((c) => ({
        id: c.id, slug: c.slug, kind: "AUTO" as const,
        title: c.title, price: c.price, priceType: c.priceType,
        city: c.city, images: c.images,
        image: (() => { try { const imgs = JSON.parse(c.images || "[]"); return imgs[0] || null; } catch { return null; } })(),
        badge: c.badge,
        planType: c.planType, isBoosted: c.isBoosted,
        status: c.status, featured: c.featured,
        category: c.category || c.brand, year: c.year,
        createdAt: c.createdAt, views: c.views,
        description: c.description,
        details: { brand: c.brand, model: c.model, fuel: c.fuel, mileage: c.mileage, transmission: c.transmission, color: c.color, condition: c.condition },
      })),
      ...properties.map((p) => ({
        id: p.id, slug: p.slug, kind: "IMMO" as const,
        title: p.title, price: p.price, priceType: p.priceType,
        city: p.city, images: p.images,
        image: (() => { try { const imgs = JSON.parse(p.images || "[]"); return imgs[0] || null; } catch { return null; } })(),
        badge: p.badge,
        planType: p.planType, isBoosted: p.isBoosted,
        status: p.status, featured: p.featured,
        category: p.type, year: null,
        createdAt: p.createdAt, views: p.views,
        description: p.description,
        details: { type: p.type, bedrooms: p.bedrooms, bathrooms: p.bathrooms, surface: p.surface, land: p.land, district: p.district },
      })),
    ];

    // Sort merged list (for ALL mode)
    if (kind === "ALL") {
      if (sort === "recent")     listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (sort === "price_asc")  listings.sort((a, b) => a.price - b.price);
      if (sort === "price_desc") listings.sort((a, b) => b.price - a.price);
      if (sort === "boost")      listings.sort((a, b) => (b.isBoosted ? 1 : 0) - (a.isBoosted ? 1 : 0));
    }

    // Paginate merged results
    const paged = kind === "ALL" ? listings.slice(skip, skip + limit) : listings;
    const total = kind === "ALL" ? totalCars + totalProps
                : kind === "AUTO" ? totalCars : totalProps;

    return NextResponse.json({
      listings: paged,
      total,
      page,
      pages: Math.ceil(total / limit),
      counts: { auto: totalCars, immo: totalProps },
    });
  } catch (e) {
    console.error("[ANNONCES GET]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-")
    + "-" + Date.now();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (!type || !data.title || !data.price) {
      return NextResponse.json({ error: "Champs obligatoires manquants (titre, prix, type)" }, { status: 400 });
    }

    const price = parseInt(String(data.price));
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
    }

    if (data.title.length > 200 || (data.description && data.description.length > 5000)) {
      return NextResponse.json({ error: "Contenu trop long" }, { status: 400 });
    }

    if (type === "AUTOMOBILE") {
      const car = await prisma.car.create({
        data: {
          title:        data.title.trim(),
          slug:         slugify(data.title),
          description:  data.description?.trim() || null,
          price,
          priceType:    data.priceType || "SALE",
          year:         data.year     ? parseInt(data.year)     : null,
          mileage:      data.mileage  ? parseInt(data.mileage)  : null,
          fuel:         data.fuel         || null,
          transmission: data.transmission || null,
          brand:        data.brand        || null,
          model:        data.model        || null,
          city:         data.city         || null,
          location:     data.location     || null,
          color:        data.color        || null,
          images:       JSON.stringify(Array.isArray(data.images) ? data.images : []),
          status:       "PENDING",
          badge:        "Nouveau",
          condition:    data.condition    || null,
        },
      });
      return NextResponse.json({ success: true, id: car.id, type: "AUTOMOBILE", slug: car.slug }, { status: 201 });
    }

    if (type === "IMMOBILIER") {
      const property = await prisma.property.create({
        data: {
          title:       data.title.trim(),
          slug:        slugify(data.title),
          description: data.description?.trim() || null,
          price,
          priceType:   data.priceType || "SALE",
          type:        data.propertyType || "HOUSE",
          bedrooms:    data.rooms   ? parseInt(data.rooms)   : null,
          bathrooms:   data.baths   ? parseInt(data.baths)   : null,
          surface:     data.surface ? parseInt(data.surface) : null,
          land:        data.land    ? parseInt(data.land)    : null,
          city:        data.city       || null,
          location:    data.location   || null,
          district:    data.district   || null,
          images:      JSON.stringify(Array.isArray(data.images) ? data.images : []),
          status:      "PENDING",
          badge:       "Nouveau",
        },
      });
      return NextResponse.json({ success: true, id: property.id, type: "IMMOBILIER", slug: property.slug }, { status: 201 });
    }

    return NextResponse.json({ error: "Type invalide. Valeurs : AUTOMOBILE | IMMOBILIER" }, { status: 400 });
  } catch (e: any) {
    console.error("[POST /api/annonces]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
