import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE = process.env.NEXTAUTH_URL?.replace("http://localhost:4000", "https://nova.ci") || "https://nova.ci";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/automobile`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/immobilier`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/annonces`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/sitemap`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const [cars, properties, posts] = await Promise.all([
      prisma.car.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true }, take: 500 }),
      prisma.property.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true }, take: 500 }),
      prisma.blogPost.findMany({ where: { publishedAt: { not: null } }, select: { slug: true, updatedAt: true }, take: 200 }),
    ]);

    const carRoutes: MetadataRoute.Sitemap = cars.map(c => ({
      url: `${BASE}/automobile/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const propRoutes: MetadataRoute.Sitemap = properties.map(p => ({
      url: `${BASE}/immobilier/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map(b => ({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...carRoutes, ...propRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}