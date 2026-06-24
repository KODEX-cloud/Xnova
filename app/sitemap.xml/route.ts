import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const base = process.env.NEXTAUTH_URL || "https://nova.ci";

  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/automobile", priority: "0.9", changefreq: "daily" },
    { url: "/immobilier", priority: "0.9", changefreq: "daily" },
    { url: "/annonces", priority: "0.9", changefreq: "daily" },
    { url: "/services", priority: "0.8", changefreq: "weekly" },
    { url: "/services/location-voiture", priority: "0.7", changefreq: "monthly" },
    { url: "/services/location-immo", priority: "0.7", changefreq: "monthly" },
    { url: "/services/achat-vente-immo", priority: "0.7", changefreq: "monthly" },
    { url: "/services/pieces-auto", priority: "0.7", changefreq: "monthly" },
    { url: "/services/flotte", priority: "0.7", changefreq: "monthly" },
    { url: "/blog", priority: "0.8", changefreq: "daily" },
    { url: "/about", priority: "0.6", changefreq: "monthly" },
    { url: "/contact", priority: "0.6", changefreq: "monthly" },
    { url: "/faq", priority: "0.5", changefreq: "monthly" },
    { url: "/pricing", priority: "0.5", changefreq: "weekly" },
    { url: "/confidentialite", priority: "0.3", changefreq: "yearly" },
    { url: "/cgu", priority: "0.3", changefreq: "yearly" },
  ];

  let cars: { slug: string; updatedAt: Date }[] = [];
  let properties: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];

  try {
    [cars, properties, posts] = await Promise.all([
      prisma.car.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
      prisma.property.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {}

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const today = fmt(new Date());

  const entries = [
    ...staticRoutes.map(r => `  <url><loc>${base}${r.url}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority><lastmod>${today}</lastmod></url>`),
    ...cars.map(c => `  <url><loc>${base}/automobile/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${fmt(c.updatedAt)}</lastmod></url>`),
    ...properties.map(p => `  <url><loc>${base}/immobilier/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${fmt(p.updatedAt)}</lastmod></url>`),
    ...posts.map(b => `  <url><loc>${base}/blog/${b.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${fmt(b.updatedAt)}</lastmod></url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
