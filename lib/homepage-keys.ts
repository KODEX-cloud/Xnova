export const HOMEPAGE_KEYS = [
  // Hero
  "homepage.heroType",        // "split" | "video" | "slider"
  "homepage.heroTitle",
  "homepage.heroSubtitle",
  "homepage.heroBadge",
  "homepage.heroCta1Text",
  "homepage.heroCta1Link",
  "homepage.heroCta2Text",
  "homepage.heroCta2Link",
  "homepage.heroOverlay",     // "0.0" – "1.0"
  "homepage.heroVideoUrl",
  "homepage.heroSlides",      // JSON: [{image, title, subtitle}]
  // Section toggles
  "homepage.sectionStats",
  "homepage.sectionCategories",
  "homepage.sectionOffers",
  "homepage.sectionWhyNova",
  "homepage.sectionBlog",
  "homepage.sectionCta",
  // Section order
  "homepage.sectionsOrder",   // JSON: string[]
  // CTA section
  "homepage.ctaTitle",
  "homepage.ctaSubtitle",
  "homepage.ctaBg",
  "homepage.ctaBtn1Text",
  "homepage.ctaBtn1Link",
  "homepage.ctaBtn2Text",
  "homepage.ctaBtn2Link",
];

export type HomepageConfig = {
  heroType: "split" | "video" | "slider";
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroOverlay: string;
  heroVideoUrl: string;
  heroSlides: { image: string; title: string; subtitle: string }[];
  sectionStats: boolean;
  sectionCategories: boolean;
  sectionOffers: boolean;
  sectionWhyNova: boolean;
  sectionBlog: boolean;
  sectionCta: boolean;
  sectionsOrder: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBg: string;
  ctaBtn1Text: string;
  ctaBtn1Link: string;
  ctaBtn2Text: string;
  ctaBtn2Link: string;
};

export const HOMEPAGE_DEFAULTS: HomepageConfig = {
  heroType: "split",
  heroTitle: "Trouvez votre voiture ou votre bien immobilier en toute confiance",
  heroSubtitle: "Achetez, louez ou investissez avec NOVA — le marketplace premium de Côte d'Ivoire. Plus de 2 000 annonces vérifiées.",
  heroBadge: "Marketplace #1 · Côte d'Ivoire",
  heroCta1Text: "Explorer les voitures",
  heroCta1Link: "/automobile/vente",
  heroCta2Text: "Immobilier",
  heroCta2Link: "/immobilier",
  heroOverlay: "0.55",
  heroVideoUrl: "",
  heroSlides: [
    { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80", title: "Voitures de Prestige", subtitle: "BMW, Mercedes, Range Rover — les meilleures marques en Côte d'Ivoire" },
    { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80", title: "Immobilier Premium", subtitle: "Villas, appartements et terrains à Abidjan et partout en CI" },
    { image: "https://images.unsplash.com/photo-1625425048259-a31c7ebc79db?w=1920&q=80", title: "Location Automobile", subtitle: "Courte et longue durée — dès 25 000 FCFA/jour" },
  ],
  sectionStats: true,
  sectionCategories: true,
  sectionOffers: true,
  sectionWhyNova: true,
  sectionBlog: true,
  sectionCta: true,
  sectionsOrder: ["stats", "categories", "offers", "whyNova", "blog", "cta"],
  ctaTitle: "Prêt à publier votre annonce ?",
  ctaSubtitle: "Rejoignez des milliers de vendeurs et acheteurs sur NOVA. Publication rapide, visibilité maximale.",
  ctaBg: "#F97316",
  ctaBtn1Text: "Publier une annonce",
  ctaBtn1Link: "/publier",
  ctaBtn2Text: "Nous contacter",
  ctaBtn2Link: "/contact",
};

export function parseHomepageConfig(raw: Record<string, string>): HomepageConfig {
  let slides = HOMEPAGE_DEFAULTS.heroSlides;
  try { slides = JSON.parse(raw["heroSlides"] || "[]"); } catch {}
  let order = HOMEPAGE_DEFAULTS.sectionsOrder;
  try { order = JSON.parse(raw["sectionsOrder"] || "[]"); if (!order.length) order = HOMEPAGE_DEFAULTS.sectionsOrder; } catch {}

  return {
    heroType: (raw["heroType"] as HomepageConfig["heroType"]) || HOMEPAGE_DEFAULTS.heroType,
    heroTitle: raw["heroTitle"] || HOMEPAGE_DEFAULTS.heroTitle,
    heroSubtitle: raw["heroSubtitle"] || HOMEPAGE_DEFAULTS.heroSubtitle,
    heroBadge: raw["heroBadge"] || HOMEPAGE_DEFAULTS.heroBadge,
    heroCta1Text: raw["heroCta1Text"] || HOMEPAGE_DEFAULTS.heroCta1Text,
    heroCta1Link: raw["heroCta1Link"] || HOMEPAGE_DEFAULTS.heroCta1Link,
    heroCta2Text: raw["heroCta2Text"] || HOMEPAGE_DEFAULTS.heroCta2Text,
    heroCta2Link: raw["heroCta2Link"] || HOMEPAGE_DEFAULTS.heroCta2Link,
    heroOverlay: raw["heroOverlay"] || HOMEPAGE_DEFAULTS.heroOverlay,
    heroVideoUrl: raw["heroVideoUrl"] || "",
    heroSlides: slides.length ? slides : HOMEPAGE_DEFAULTS.heroSlides,
    sectionStats: raw["sectionStats"] !== "false",
    sectionCategories: raw["sectionCategories"] !== "false",
    sectionOffers: raw["sectionOffers"] !== "false",
    sectionWhyNova: raw["sectionWhyNova"] !== "false",
    sectionBlog: raw["sectionBlog"] !== "false",
    sectionCta: raw["sectionCta"] !== "false",
    sectionsOrder: order,
    ctaTitle: raw["ctaTitle"] || HOMEPAGE_DEFAULTS.ctaTitle,
    ctaSubtitle: raw["ctaSubtitle"] || HOMEPAGE_DEFAULTS.ctaSubtitle,
    ctaBg: raw["ctaBg"] || HOMEPAGE_DEFAULTS.ctaBg,
    ctaBtn1Text: raw["ctaBtn1Text"] || HOMEPAGE_DEFAULTS.ctaBtn1Text,
    ctaBtn1Link: raw["ctaBtn1Link"] || HOMEPAGE_DEFAULTS.ctaBtn1Link,
    ctaBtn2Text: raw["ctaBtn2Text"] || HOMEPAGE_DEFAULTS.ctaBtn2Text,
    ctaBtn2Link: raw["ctaBtn2Link"] || HOMEPAGE_DEFAULTS.ctaBtn2Link,
  };
}
