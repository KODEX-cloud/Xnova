export type SectionType =
  | "hero"
  | "listings"
  | "stats"
  | "testimonials"
  | "blog"
  | "faq"
  | "cta"
  | "promotions"
  | "services"
  | "gallery"
  | "contact"
  | "richtext"
  | "search";

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
  label?: string;
  props: Record<string, unknown>;
}

// ── Per-section prop shapes ──────────────────────────────────────────────────

export interface HeroProps {
  badge: string;
  line1: string;
  line2: string;
  subtitle: string;
  backgroundImage: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
}

export interface ListingsProps {
  heading: string;
  subheading: string;
  listingType: "cars" | "properties" | "both";
  limit: number;
  featuredOnly: boolean;
}

export interface StatsProps {
  heading: string;
  items: Array<{
    icon: string;
    value: number;
    suffix: string;
    label: string;
    description: string;
  }>;
}

export interface TestimonialsProps {
  heading: string;
  subheading: string;
}

export interface BlogProps {
  heading: string;
  subheading: string;
  limit: number;
  category?: string;
}

export interface FaqProps {
  heading: string;
  subheading: string;
  items: Array<{ question: string; answer: string }>;
}

export interface CtaProps {
  heading: string;
  subheading: string;
  btnText: string;
  btnHref: string;
  variant: "gradient" | "solid" | "outline";
}

export interface PromotionsProps {
  heading: string;
  subheading: string;
}

export interface ServicesProps {
  heading: string;
  subheading: string;
  items: Array<{ icon: string; title: string; description: string }>;
}

export interface GalleryProps {
  heading: string;
  images: string[];
  columns: number;
}

export interface ContactProps {
  heading: string;
  subheading: string;
  showMap: boolean;
  mapEmbedUrl?: string;
}

export interface RichTextProps {
  content: string;
}

export interface SearchProps {
  heading: string;
  defaultType: "cars" | "properties";
}

// ── Default props per section type ──────────────────────────────────────────

export const SECTION_DEFAULTS: Record<SectionType, PageSection["props"]> = {
  hero: {
    badge: "Marketplace #1 en Côte d'Ivoire",
    line1: "Votre Partenaire",
    line2: "Premium CI",
    subtitle: "Découvrez les meilleures voitures et propriétés d'Abidjan.",
    backgroundImage: "",
    primaryBtnText: "Explorer les annonces",
    primaryBtnHref: "#annonces",
    secondaryBtnText: "Déposer une annonce",
    secondaryBtnHref: "#contact",
  },
  listings: {
    heading: "Nos meilleures offres",
    subheading: "Sélection premium mise à jour quotidiennement",
    listingType: "both",
    limit: 6,
    featuredOnly: true,
  },
  stats: {
    heading: "La confiance, ça se mesure",
    items: [
      { icon: "Car", value: 1200, suffix: "+", label: "Voitures disponibles", description: "BMW, Mercedes, Toyota et plus" },
      { icon: "Home", value: 800, suffix: "+", label: "Propriétés listées", description: "Villas, appartements, terrains" },
      { icon: "Users", value: 5000, suffix: "+", label: "Clients satisfaits", description: "À Abidjan et dans tout le pays" },
      { icon: "Star", value: 4.9, suffix: "/5", label: "Note moyenne", description: "Basé sur 1200 avis" },
    ],
  },
  testimonials: {
    heading: "Ils nous font confiance",
    subheading: "Des milliers de clients satisfaits témoignent de leur expérience avec NOVA",
  },
  blog: {
    heading: "Nos derniers articles",
    subheading: "Conseils d'experts, tendances du marché et guides pratiques",
    limit: 3,
  },
  faq: {
    heading: "Questions fréquentes",
    subheading: "Tout ce que vous devez savoir sur nos services",
    items: [
      { question: "Comment puis-je déposer une annonce ?", answer: "Contactez-nous via le formulaire ou par WhatsApp." },
      { question: "Quels documents sont nécessaires ?", answer: "CNI/Passeport, documents du véhicule ou titre foncier." },
    ],
  },
  cta: {
    heading: "Prêt à trouver votre prochain bien ?",
    subheading: "Rejoignez des milliers de clients satisfaits en Côte d'Ivoire",
    btnText: "Commencer maintenant",
    btnHref: "#contact",
    variant: "gradient",
  },
  promotions: {
    heading: "Saisir les meilleures opportunités",
    subheading: "Offres et promotions exclusives pour nos clients",
  },
  services: {
    heading: "Nos services",
    subheading: "Des solutions complètes pour vos besoins automobile et immobilier",
    items: [
      { icon: "Car", title: "Vente automobile", description: "Achat et vente de véhicules premium" },
      { icon: "Building2", title: "Immobilier", description: "Villas, appartements, terrains" },
      { icon: "Key", title: "Location", description: "Location courte et longue durée" },
      { icon: "Shield", title: "Garantie", description: "Véhicules et biens vérifiés" },
    ],
  },
  gallery: {
    heading: "Notre galerie",
    images: [],
    columns: 3,
  },
  contact: {
    heading: "Contactez-nous",
    subheading: "Notre équipe est disponible pour vous accompagner",
    showMap: false,
    mapEmbedUrl: "",
  },
  richtext: {
    content: "<p>Ajoutez votre contenu ici...</p>",
  },
  search: {
    heading: "Trouver votre bien",
    defaultType: "cars",
  },
};

export const SECTION_META: Record<SectionType, { label: string; icon: string; description: string }> = {
  hero: { label: "Hero Banner", icon: "Layers", description: "Grande bannière d'accueil avec titre et CTA" },
  listings: { label: "Annonces", icon: "Grid3X3", description: "Grille de voitures ou propriétés" },
  stats: { label: "Statistiques", icon: "BarChart2", description: "Compteurs animés (clients, annonces...)" },
  testimonials: { label: "Témoignages", icon: "MessageSquare", description: "Carrousel d'avis clients" },
  blog: { label: "Articles Blog", icon: "BookOpen", description: "Derniers articles publiés" },
  faq: { label: "FAQ", icon: "HelpCircle", description: "Questions / réponses accordéon" },
  cta: { label: "Appel à l'action", icon: "Zap", description: "Bouton d'action avec texte persuasif" },
  promotions: { label: "Promotions", icon: "Tag", description: "Offres et promotions actives" },
  services: { label: "Services", icon: "Briefcase", description: "Liste des services proposés" },
  gallery: { label: "Galerie", icon: "Image", description: "Grille d'images" },
  contact: { label: "Contact", icon: "Mail", description: "Formulaire de contact" },
  richtext: { label: "Texte libre", icon: "FileText", description: "Contenu HTML personnalisé" },
  search: { label: "Recherche", icon: "Search", description: "Barre de recherche d'annonces" },
};
