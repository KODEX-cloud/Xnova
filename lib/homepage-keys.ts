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
  // Dynamic Content Sections
  "homepage.statsTitle",
  "homepage.statsSubtitle",
  "homepage.stats",           // JSON
  "homepage.whyNovaTitle",
  "homepage.whyNovaSubtitle",
  "homepage.whyNova",          // JSON
  "homepage.categoriesTitle",
  "homepage.categoriesSubtitle",
  "homepage.categories",      // JSON
  // Section pills (labels)
  "homepage.statsLabel",
  "homepage.whyNovaLabel",
  "homepage.categoriesLabel",
  "homepage.ctaLabel",
  // Featured listings section
  "homepage.featuredLabel",
  "homepage.featuredTitle",
  "homepage.featuredSubtitle",
  // Blog section
  "homepage.blogLabel",
  "homepage.blogTitle",
  "homepage.blogSubtitle",
  // Hero split — floating card
  "homepage.showHeroCard",
  "homepage.heroCardBadge",
  "homepage.heroCardPrice",
  "homepage.heroCardTitle",
  "homepage.heroCardSpecs",   // JSON: string[]
  "homepage.heroCardLocation",
  "homepage.heroCardLink",
  // Hero split — floating stats widget
  "homepage.heroStats",       // JSON: [{value, label}]
  // Hero split — floating activity widget
  "homepage.heroActivity",    // JSON: [{action, time}]
  // Hero split — popular badge
  "homepage.heroPopularBadge",
  // Hero split — trust badges (below subtitle)
  "homepage.heroTrustBadges", // JSON: [{label, icon, color}]
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
  // Dynamic Content Sections
  statsTitle: string;
  statsSubtitle: string;
  stats: { icon: string; value: number; suffix: string; label: string; sub: string; accent: string; isDecimal?: boolean }[];
  whyNovaTitle: string;
  whyNovaSubtitle: string;
  whyNova: { icon: string; title: string; description: string; gradient: string; accent: string; border: string; hoverBorder: string; hoverShadow: string; chip: { bg: string; text: string; label: string } }[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  categories: { icon: string; label: string; description: string; href: string; gradient: string; glow: string; badge: string; badgeColor: string; hoverBorder: string; bg: string }[];
  statsLabel: string;
  whyNovaLabel: string;
  categoriesLabel: string;
  ctaLabel: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredSubtitle: string;
  blogLabel: string;
  blogTitle: string;
  blogSubtitle: string;
  showHeroCard: boolean;
  heroCardBadge: string;
  heroCardPrice: string;
  heroCardTitle: string;
  heroCardSpecs: string[];
  heroCardLocation: string;
  heroCardLink: string;
  heroStats: { value: string; label: string }[];
  heroActivity: { action: string; time: string }[];
  heroPopularBadge: string;
  heroTrustBadges: { label: string; icon: string; color: string }[];
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
  // Dynamic Content Sections Defaults
  statsTitle: "La confiance, ça se mesure",
  statsSubtitle: "Des milliers de clients font confiance à NOVA chaque mois pour leurs projets automobile et immobilier",
  stats: [
    { icon: "Car", value: 1200, suffix: "+", label: "Voitures", sub: "Toutes marques", accent: "from-nova-red to-nova-orange" },
    { icon: "Home", value: 800, suffix: "+", label: "Propriétés", sub: "Villas & appartements", accent: "from-blue-500 to-blue-400" },
    { icon: "Users", value: 5000, suffix: "+", label: "Clients satisfaits", sub: "Abidjan & CI", accent: "from-emerald-500 to-teal-400" },
    { icon: "Star", value: 4.9, suffix: "/5", label: "Note moyenne", sub: "1 200 avis vérifiés", accent: "from-amber-400 to-yellow-300", isDecimal: true },
    { icon: "Award", value: 8, suffix: " ans", label: "D'expérience", sub: "Leader du marché", accent: "from-purple-500 to-violet-400" },
    { icon: "MapPin", value: 7, suffix: " villes", label: "Présence", sub: "Bouaké, San-Pédro…", accent: "from-rose-500 to-pink-400" },
  ],
  whyNovaTitle: "La plateforme qui vous fait confiance",
  whyNovaSubtitle: "Des milliers de clients font confiance à NOVA chaque mois pour leurs projets automobile et immobilier en Côte d'Ivoire.",
  whyNova: [
    { icon: "ShieldCheck", title: "Transactions sécurisées", description: "Chaque annonce est vérifiée par notre équipe. Vos paiements et données sont protégés à chaque étape.", gradient: "from-emerald-500 to-teal-500", accent: "bg-emerald-50", border: "border-emerald-100", hoverBorder: "hover:border-emerald-200", hoverShadow: "hover:shadow-emerald-100/60", chip: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Sécurisé" } },
    { icon: "LayoutGrid", title: "Large choix de biens", description: "Plus de 2 000 annonces automobile et immobilier, mises à jour quotidiennement pour ne rater aucune offre.", gradient: "from-blue-500 to-indigo-500", accent: "bg-blue-50", border: "border-blue-100", hoverBorder: "hover:border-blue-200", hoverShadow: "hover:shadow-blue-100/60", chip: { bg: "bg-blue-100", text: "text-blue-700", label: "2 000+ offres" } },
    { icon: "Headphones", title: "Support client rapide", description: "Notre équipe répond en moins de 2 heures. Disponible 7j/7 par WhatsApp, téléphone et chat en ligne.", gradient: "from-nova-red to-nova-orange", accent: "bg-orange-50", border: "border-orange-100", hoverBorder: "hover:border-orange-200", hoverShadow: "hover:shadow-orange-100/60", chip: { bg: "bg-orange-100", text: "text-nova-red", label: "Réponse < 2h" } },
    { icon: "BadgeCheck", title: "Offres 100% vérifiées", description: "Chaque annonce est contrôlée par nos équipes. Aucune arnaque, aucune fausse offre n'est tolérée.", gradient: "from-nova-orange to-amber-400", accent: "bg-amber-50", border: "border-amber-100", hoverBorder: "hover:border-amber-200", hoverShadow: "hover:shadow-amber-100/60", chip: { bg: "bg-amber-100", text: "text-amber-700", label: "Anti-arnaque" } },
    { icon: "TrendingUp", title: "Meilleurs prix du marché", description: "Nos experts négocient pour vous obtenir les meilleures conditions d'achat ou de location en CI.", gradient: "from-purple-500 to-violet-500", accent: "bg-purple-50", border: "border-purple-100", hoverBorder: "hover:border-purple-200", hoverShadow: "hover:shadow-purple-100/60", chip: { bg: "bg-purple-100", text: "text-purple-700", label: "Prix négocié" } },
    { icon: "Clock", title: "Processus ultra-rapide", description: "De la recherche à la signature — nous optimisons chaque étape pour vous faire gagner un temps précieux.", gradient: "from-rose-500 to-pink-500", accent: "bg-rose-50", border: "border-rose-100", hoverBorder: "hover:border-rose-200", hoverShadow: "hover:shadow-rose-100/60", chip: { bg: "bg-rose-100", text: "text-rose-700", label: "Rapide" } },
  ],
  categoriesTitle: "Que recherchez-vous ?",
  categoriesSubtitle: "Sélectionnez une catégorie pour démarrer votre recherche",
  showHeroCard: true,
  heroCardBadge: "⚡ Coup de cœur",
  heroCardPrice: "28 500 000 FCFA",
  heroCardTitle: "BMW X5 2023 — Xdrive 40i",
  heroCardSpecs: ["2023", "Essence", "12 500 km"],
  heroCardLocation: "Cocody, Abidjan · Automatique",
  heroCardLink: "/automobile/vente",
  heroStats: [
    { value: "1 200+", label: "Voitures" },
    { value: "800+", label: "Biens immo" },
    { value: "98%", label: "Satisfaction" },
  ],
  heroActivity: [
    { action: "Nouvelle BMW X5 publiée", time: "il y a 2 min" },
    { action: "Villa Cocody réservée", time: "il y a 8 min" },
  ],
  heroPopularBadge: "Populaire",
  heroTrustBadges: [
    { label: "Annonces vérifiées", icon: "CheckCircle2", color: "text-emerald-600" },
    { label: "Paiement sécurisé", icon: "Shield", color: "text-blue-600" },
    { label: "Réponse en 2h", icon: "Zap", color: "text-nova-red" },
  ],
  statsLabel: "NOVA en chiffres",
  whyNovaLabel: "Pourquoi NOVA ?",
  categoriesLabel: "Catégories",
  ctaLabel: "Rejoignez NOVA",
  featuredLabel: "Annonces vedettes",
  featuredTitle: "Nos meilleures offres",
  featuredSubtitle: "Sélection premium mise à jour quotidiennement",
  blogLabel: "Blog & Conseils",
  blogTitle: "Nos derniers articles",
  blogSubtitle: "Conseils d'experts, tendances du marché et guides pratiques",
  categories: [
    { icon: "CarFront", label: "Acheter une voiture", description: "Neuves et occasions", href: "/automobile/vente", gradient: "from-orange-500 to-red-500", glow: "shadow-orange-200/80", badge: "1 200+ offres", badgeColor: "text-orange-600 bg-orange-50", hoverBorder: "hover:border-orange-200", bg: "from-orange-50/80 to-white" },
    { icon: "Key", label: "Louer une voiture", description: "Dès 25 000 CFA/jour", href: "/automobile/location", gradient: "from-amber-500 to-orange-400", glow: "shadow-amber-200/80", badge: "Courte durée", badgeColor: "text-amber-700 bg-amber-50", hoverBorder: "hover:border-amber-200", bg: "from-amber-50/80 to-white" },
    { icon: "Home", label: "Acheter une maison", description: "Villas, appartements", href: "/immobilier/vente", gradient: "from-blue-500 to-indigo-500", glow: "shadow-blue-200/80", badge: "500+ biens", badgeColor: "text-blue-700 bg-blue-50", hoverBorder: "hover:border-blue-200", bg: "from-blue-50/80 to-white" },
    { icon: "Building2", label: "Louer un bien", description: "Meublé & non meublé", href: "/immobilier/location", gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-200/80", badge: "Longue durée", badgeColor: "text-emerald-700 bg-emerald-50", hoverBorder: "hover:border-emerald-200", bg: "from-emerald-50/80 to-white" },
    { icon: "MapPin", label: "Acheter un terrain", description: "Titres fonciers sécurisés", href: "/immobilier/terrains", gradient: "from-purple-500 to-violet-500", glow: "shadow-purple-200/80", badge: "Titres fonciers", badgeColor: "text-purple-700 bg-purple-50", hoverBorder: "hover:border-purple-200", bg: "from-purple-50/80 to-white" },
  ],
};

export function parseHomepageConfig(raw: Record<string, string>): HomepageConfig {
  let slides = HOMEPAGE_DEFAULTS.heroSlides;
  try { slides = JSON.parse(raw["heroSlides"] || "[]"); } catch {}
  let order = HOMEPAGE_DEFAULTS.sectionsOrder;
  try { order = JSON.parse(raw["sectionsOrder"] || "[]"); if (!order.length) order = HOMEPAGE_DEFAULTS.sectionsOrder; } catch {}

  let stats = HOMEPAGE_DEFAULTS.stats;
  try { const parsed = JSON.parse(raw["stats"] || "[]"); if (parsed.length) stats = parsed; } catch {}
  let whyNova = HOMEPAGE_DEFAULTS.whyNova;
  try { const parsed = JSON.parse(raw["whyNova"] || "[]"); if (parsed.length) whyNova = parsed; } catch {}
  let categories = HOMEPAGE_DEFAULTS.categories;
  try { const parsed = JSON.parse(raw["categories"] || "[]"); if (parsed.length) categories = parsed; } catch {}

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
    // Dynamic Content Sections
    statsTitle: raw["statsTitle"] || HOMEPAGE_DEFAULTS.statsTitle,
    statsSubtitle: raw["statsSubtitle"] || HOMEPAGE_DEFAULTS.statsSubtitle,
    stats,
    whyNovaTitle: raw["whyNovaTitle"] || HOMEPAGE_DEFAULTS.whyNovaTitle,
    whyNovaSubtitle: raw["whyNovaSubtitle"] || HOMEPAGE_DEFAULTS.whyNovaSubtitle,
    whyNova,
    categoriesTitle: raw["categoriesTitle"] || HOMEPAGE_DEFAULTS.categoriesTitle,
    categoriesSubtitle: raw["categoriesSubtitle"] || HOMEPAGE_DEFAULTS.categoriesSubtitle,
    categories,
    showHeroCard: raw["showHeroCard"] !== "false",
    heroCardBadge: raw["heroCardBadge"] || HOMEPAGE_DEFAULTS.heroCardBadge,
    heroCardPrice: raw["heroCardPrice"] || HOMEPAGE_DEFAULTS.heroCardPrice,
    heroCardTitle: raw["heroCardTitle"] || HOMEPAGE_DEFAULTS.heroCardTitle,
    heroCardSpecs: (() => { try { const p = JSON.parse(raw["heroCardSpecs"] || "[]"); return p.length ? p : HOMEPAGE_DEFAULTS.heroCardSpecs; } catch { return HOMEPAGE_DEFAULTS.heroCardSpecs; } })(),
    heroCardLocation: raw["heroCardLocation"] || HOMEPAGE_DEFAULTS.heroCardLocation,
    heroCardLink: raw["heroCardLink"] || HOMEPAGE_DEFAULTS.heroCardLink,
    heroStats: (() => { try { const p = JSON.parse(raw["heroStats"] || "[]"); return p.length ? p : HOMEPAGE_DEFAULTS.heroStats; } catch { return HOMEPAGE_DEFAULTS.heroStats; } })(),
    heroActivity: (() => { try { const p = JSON.parse(raw["heroActivity"] || "[]"); return p.length ? p : HOMEPAGE_DEFAULTS.heroActivity; } catch { return HOMEPAGE_DEFAULTS.heroActivity; } })(),
    heroPopularBadge: raw["heroPopularBadge"] || HOMEPAGE_DEFAULTS.heroPopularBadge,
    heroTrustBadges: (() => { try { const p = JSON.parse(raw["heroTrustBadges"] || "[]"); return p.length ? p : HOMEPAGE_DEFAULTS.heroTrustBadges; } catch { return HOMEPAGE_DEFAULTS.heroTrustBadges; } })(),
    statsLabel: raw["statsLabel"] || HOMEPAGE_DEFAULTS.statsLabel,
    whyNovaLabel: raw["whyNovaLabel"] || HOMEPAGE_DEFAULTS.whyNovaLabel,
    categoriesLabel: raw["categoriesLabel"] || HOMEPAGE_DEFAULTS.categoriesLabel,
    ctaLabel: raw["ctaLabel"] || HOMEPAGE_DEFAULTS.ctaLabel,
    featuredLabel: raw["featuredLabel"] || HOMEPAGE_DEFAULTS.featuredLabel,
    featuredTitle: raw["featuredTitle"] || HOMEPAGE_DEFAULTS.featuredTitle,
    featuredSubtitle: raw["featuredSubtitle"] || HOMEPAGE_DEFAULTS.featuredSubtitle,
    blogLabel: raw["blogLabel"] || HOMEPAGE_DEFAULTS.blogLabel,
    blogTitle: raw["blogTitle"] || HOMEPAGE_DEFAULTS.blogTitle,
    blogSubtitle: raw["blogSubtitle"] || HOMEPAGE_DEFAULTS.blogSubtitle,
  };
}
