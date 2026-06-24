import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export async function getPageSeo(slug: string, defaults?: { title?: string; description?: string }): Promise<Metadata> {
  try {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (page) {
      return {
        title: page.seoTitle || defaults?.title || `NOVA — ${slug}`,
        description: page.metaDescription || defaults?.description || undefined,
        openGraph: {
          title: page.seoTitle || defaults?.title || `NOVA — ${slug}`,
          description: page.metaDescription || defaults?.description || undefined,
          images: (page as any).ogImage ? [{ url: (page as any).ogImage }] : undefined,
        },
        robots: (page as any).noIndex ? { index: false, follow: false } : undefined,
      };
    }
  } catch {}

  return {
    title: defaults?.title || `NOVA — ${slug}`,
    description: defaults?.description,
  };
}
