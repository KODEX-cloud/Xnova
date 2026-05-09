import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomepageHero from "@/components/sections/HomepageHero";
import HomepageCtaSection from "@/components/sections/HomepageCtaSection";
import StatsSection from "@/components/sections/StatsSection";
import QuickCategoriesSection from "@/components/sections/QuickCategoriesSection";
import FeaturedListings from "@/components/sections/FeaturedListings";
import WhyNovaSection from "@/components/sections/WhyNovaSection";
import BlogSection from "@/components/sections/BlogSection";
import { HOMEPAGE_DEFAULTS, parseHomepageConfig } from "@/lib/homepage-keys";
import type { HomepageConfig } from "@/lib/homepage-keys";

export const revalidate = 60;

async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSetting.findMany({
      where: { key: { startsWith: "homepage." } },
    });
    const raw: Record<string, string> = {};
    rows.forEach((r) => {
      raw[r.key.replace("homepage.", "")] = r.value || "";
    });
    return parseHomepageConfig(raw);
  } catch {
    return HOMEPAGE_DEFAULTS;
  }
}

const SECTION_MAP: Record<string, (config: HomepageConfig) => ReactNode> = {
  stats:      () => <StatsSection />,
  categories: () => <QuickCategoriesSection />,
  offers:     () => <FeaturedListings />,
  whyNova:    () => <WhyNovaSection />,
  blog:       () => <BlogSection />,
  cta:        (c) => <HomepageCtaSection config={c} />,
};

const SECTION_ENABLED: Record<string, keyof HomepageConfig> = {
  stats:      "sectionStats",
  categories: "sectionCategories",
  offers:     "sectionOffers",
  whyNova:    "sectionWhyNova",
  blog:       "sectionBlog",
  cta:        "sectionCta",
};

export default async function Home() {
  const config = await getHomepageConfig();

  const order = config.sectionsOrder.length ? config.sectionsOrder : HOMEPAGE_DEFAULTS.sectionsOrder;

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero — always first */}
      <HomepageHero config={config} />

      {/* Dynamic sections in configured order */}
      {order.map((key) => {
        const enabledKey = SECTION_ENABLED[key];
        if (enabledKey && config[enabledKey] === false) return null;
        const renderer = SECTION_MAP[key];
        if (!renderer) return null;
        return <div key={key}>{renderer(config)}</div>;
      })}

      <Footer />
    </main>
  );
}
