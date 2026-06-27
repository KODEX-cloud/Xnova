// Nova Marketplace — Subscription plans + listing boost options (SaaS v4)

export type PlanId = "FREE" | "STARTER" | "BUSINESS" | "PREMIUM" | "ENTERPRISE" | "PRO"; // PRO kept for compat
export type BoostType = "GRATUIT" | "EN_AVANT" | "PREMIUM";

// ── Subscription Plans ────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS = [
  {
    id: "FREE" as PlanId,
    name: "Gratuit", price: 0, currency: "FCFA", durationDays: 30,
    badge: null, badgeColor: null, popular: false,
    description: "Pour découvrir NOVA",
    features: ["3 annonces actives", "5 photos/annonce", "30 jours visibilité", "Support communauté"],
    limits: { maxListings: 3, maxPhotos: 5, canBoost: false, canFeature: false, prioritySupport: false, hasStats: false, hasVideo: false },
  },
  {
    id: "STARTER" as PlanId,
    name: "Starter", price: 9900, currency: "FCFA", durationDays: 30,
    badge: null, badgeColor: null, popular: false,
    description: "Pour les vendeurs débutants",
    features: ["10 annonces actives", "10 photos/annonce", "2 boosts/mois", "Statistiques", "Support email"],
    limits: { maxListings: 10, maxPhotos: 10, canBoost: true, canFeature: false, prioritySupport: false, hasStats: true, hasVideo: false },
  },
  {
    id: "BUSINESS" as PlanId,
    name: "Business", price: 24900, currency: "FCFA", durationDays: 30,
    badge: "Populaire", badgeColor: "#F97316", popular: true,
    description: "Pour les vendeurs actifs",
    features: ["50 annonces actives", "20 photos/annonce", "Vidéo incluse", "10 boosts/mois", "SEO avancé", "Stats complètes", "Support prioritaire"],
    limits: { maxListings: 50, maxPhotos: 20, canBoost: true, canFeature: false, prioritySupport: true, hasStats: true, hasVideo: true },
  },
  {
    id: "PRO" as PlanId, // Legacy alias for BUSINESS
    name: "Business", price: 24900, currency: "FCFA", durationDays: 30,
    badge: "Populaire", badgeColor: "#F97316", popular: false,
    description: "Pour les vendeurs actifs",
    features: ["50 annonces actives", "20 photos/annonce", "10 boosts/mois", "Stats complètes", "Support prioritaire"],
    limits: { maxListings: 50, maxPhotos: 20, canBoost: true, canFeature: false, prioritySupport: true, hasStats: true, hasVideo: true },
  },
  {
    id: "PREMIUM" as PlanId,
    name: "Premium", price: 49900, currency: "FCFA", durationDays: 30,
    badge: "Meilleur choix", badgeColor: "#7C3AED", popular: false,
    description: "Pour les professionnels & agences",
    features: ["200 annonces actives", "50 photos/annonce", "Vidéo HD", "50 boosts/mois", "SEO pro", "Dashboard Analytics", "Mise en avant homepage"],
    limits: { maxListings: 200, maxPhotos: 50, canBoost: true, canFeature: true, prioritySupport: true, hasStats: true, hasVideo: true },
  },
  {
    id: "ENTERPRISE" as PlanId,
    name: "Enterprise", price: 99900, currency: "FCFA", durationDays: 30,
    badge: "Enterprise", badgeColor: "#D97706", popular: false,
    description: "Pour les grandes agences & groupes",
    features: ["Annonces illimitées", "Photos illimitées", "Vidéo 4K", "Boosts illimités", "API access", "Manager dédié", "SLA garanti"],
    limits: { maxListings: -1, maxPhotos: -1, canBoost: true, canFeature: true, prioritySupport: true, hasStats: true, hasVideo: true },
  },
] as const;

// ── Listing Boost Options ─────────────────────────────────────────────────────

export const BOOST_OPTIONS = [
  {
    id: "GRATUIT" as BoostType,
    name: "Gratuit",
    price: 0,
    currency: "FCFA",
    durationDays: 30,
    description: "Publication standard",
    features: ["Visible dans les listes", "30 jours de durée", "Statistiques basiques"],
    badge: null,
    gradient: "from-gray-500 to-gray-600",
  },
  {
    id: "EN_AVANT" as BoostType,
    name: "En avant",
    price: 10000,
    currency: "FCFA",
    durationDays: 30,
    description: "Plus de visibilité",
    features: ["Badge « En avant »", "Position prioritaire", "30 jours de durée", "Statistiques détaillées"],
    badge: "En avant",
    gradient: "from-nova-red to-nova-orange",
  },
  {
    id: "PREMIUM" as BoostType,
    name: "Premium",
    price: 25000,
    currency: "FCFA",
    durationDays: 60,
    description: "Visibilité maximale",
    features: ["Badge Premium", "1ère position garantie", "60 jours de durée", "Stats temps réel", "WhatsApp prioritaire"],
    badge: "Premium",
    gradient: "from-yellow-500 to-amber-400",
  },
] as const;

// ── Payment Methods ───────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { id: "MTN",    name: "MTN Mobile Money",  flag: "🟡", prefix: "+225 07" },
  { id: "ORANGE", name: "Orange Money",      flag: "🟠", prefix: "+225 07" },
  { id: "MOOV",   name: "Moov Money",        flag: "🔵", prefix: "+225 01" },
  { id: "CARD",   name: "Carte bancaire",    flag: "💳", prefix: "" },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getPlan(id: PlanId) {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) ?? SUBSCRIPTION_PLANS[0];
}

export function getBoost(id: BoostType) {
  return BOOST_OPTIONS.find((b) => b.id === id) ?? BOOST_OPTIONS[0];
}

export function canPublish(userPlan: PlanId, currentListingCount: number): boolean {
  const plan = getPlan(userPlan);
  if (plan.limits.maxListings === -1) return true;
  return currentListingCount < plan.limits.maxListings;
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "Gratuit";
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function generatePaymentRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NOVA-${ts}-${rand}`;
}

export function planColor(plan: PlanId | string): string {
  switch (plan) {
    case "ENTERPRISE": return "text-amber-400 bg-amber-500/15 border-amber-500/30";
    case "PREMIUM":    return "text-purple-400 bg-purple-500/15 border-purple-500/30";
    case "BUSINESS":
    case "PRO":        return "text-orange-400 bg-orange-500/15 border-orange-500/30";
    case "STARTER":    return "text-blue-400 bg-blue-500/15 border-blue-500/30";
    default:           return "text-white/40 bg-white/5 border-white/10";
  }
}

export function boostColor(boost: BoostType): string {
  switch (boost) {
    case "PREMIUM":  return "text-amber-400 bg-amber-500/15 border-amber-500/30";
    case "EN_AVANT": return "text-nova-red bg-nova-red/15 border-nova-red/30";
    default:         return "text-white/40 bg-white/5 border-white/10";
  }
}
