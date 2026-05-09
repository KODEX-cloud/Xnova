// Nova Marketplace — Subscription plans + listing boost options

export type PlanId = "FREE" | "PRO" | "PREMIUM";
export type BoostType = "GRATUIT" | "EN_AVANT" | "PREMIUM";

// ── Subscription Plans ────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS = [
  {
    id: "FREE" as PlanId,
    name: "Gratuit",
    price: 0,
    currency: "FCFA",
    durationDays: 30,
    badge: null,
    badgeColor: null,
    popular: false,
    description: "Pour commencer sur NOVA",
    features: [
      "1 annonce active",
      "30 jours de visibilité",
      "Statistiques de base",
      "Support par email",
    ],
    limits: {
      maxListings: 1,
      canBoost: false,
      canFeature: false,
      prioritySupport: false,
    },
  },
  {
    id: "PRO" as PlanId,
    name: "Pro",
    price: 15000,
    currency: "FCFA",
    durationDays: 30,
    badge: "Populaire",
    badgeColor: "#F97316",
    popular: true,
    description: "Pour les vendeurs actifs",
    features: [
      "10 annonces actives",
      "60 jours de visibilité",
      "Boost d'annonces disponible",
      "Badge Pro sur vos annonces",
      "Statistiques avancées",
      "Support prioritaire",
    ],
    limits: {
      maxListings: 10,
      canBoost: true,
      canFeature: false,
      prioritySupport: true,
    },
  },
  {
    id: "PREMIUM" as PlanId,
    name: "Premium",
    price: 35000,
    currency: "FCFA",
    durationDays: 30,
    badge: "Meilleur choix",
    badgeColor: "#7C3AED",
    popular: false,
    description: "Pour les professionnels & agences",
    features: [
      "Annonces illimitées",
      "90 jours de visibilité",
      "Boost automatique inclus",
      "Badge Premium + position top",
      "Statistiques temps réel",
      "Support WhatsApp dédié",
      "Mise en avant automatique",
    ],
    limits: {
      maxListings: -1, // -1 = unlimited
      canBoost: true,
      canFeature: true,
      prioritySupport: true,
    },
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

export function planColor(plan: PlanId): string {
  switch (plan) {
    case "PREMIUM": return "text-purple-400 bg-purple-500/15 border-purple-500/30";
    case "PRO":     return "text-orange-400 bg-orange-500/15 border-orange-500/30";
    default:        return "text-white/40 bg-white/5 border-white/10";
  }
}

export function boostColor(boost: BoostType): string {
  switch (boost) {
    case "PREMIUM":  return "text-amber-400 bg-amber-500/15 border-amber-500/30";
    case "EN_AVANT": return "text-nova-red bg-nova-red/15 border-nova-red/30";
    default:         return "text-white/40 bg-white/5 border-white/10";
  }
}
