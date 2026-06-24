import {
  Car, Home, Wrench, Info, BookOpen, Phone, Plus, LayoutDashboard,
  CarFront, Building2, Key, Layers, Settings, MapPin, Warehouse,
} from "lucide-react";
import type { MegaMenuItem } from "@/components/ui/mega-menu";
import { resolveIcon } from "@/lib/icon-map";

export type MobileNavItem = {
  label: string;
  href: string;
  iconName: string;
};

export const NAV_ITEMS_DEFAULT: MegaMenuItem[] = [
  { id: 0, label: "Accueil", link: "/" },
  {
    id: 1,
    label: "Automobile",
    subMenus: [
      {
        title: "Véhicules",
        items: [
          { label: "Vente de voitures", description: "BMW, Mercedes, Toyota, Range Rover...", icon: CarFront, href: "/automobile/vente" },
          { label: "Location de voitures", description: "Courte et longue durée disponible", icon: Key, href: "/automobile/location" },
        ],
      },
      {
        title: "Services Auto",
        items: [
          { label: "Gestion de flotte", description: "Solutions pour entreprises et flottes", icon: Layers, href: "/services/flotte" },
          { label: "Vente de pièces auto", description: "Pièces neuves et d'occasion certifiées", icon: Settings, href: "/automobile/pieces" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Immobilier",
    subMenus: [
      {
        title: "Achat",
        items: [
          { label: "Acheter un bien", description: "Villas, appartements, duplexes à vendre", icon: Home, href: "/immobilier/vente" },
          { label: "Acheter un terrain", description: "Terrains viabilisés à Abidjan et environs", icon: MapPin, href: "/immobilier/terrains" },
        ],
      },
      {
        title: "Location",
        items: [
          { label: "Louer un bien", description: "Maisons et appartements en location", icon: Building2, href: "/immobilier/location" },
          { label: "Studios meublés", description: "Studios tout équipés à Abidjan", icon: Warehouse, href: "/immobilier/studios" },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Services",
    subMenus: [
      {
        title: "Automobile",
        items: [
          { label: "Location de voiture", description: "BMW, Mercedes, Range Rover — avec ou sans chauffeur", icon: Key, href: "/services/location-voiture" },
          { label: "Gestion de flotte", description: "Solutions complètes pour entreprises", icon: Layers, href: "/services/flotte" },
          { label: "Vente de pièces auto", description: "Pièces neuves & d'occasion certifiées", icon: Settings, href: "/services/pieces-auto" },
        ],
      },
      {
        title: "Immobilier",
        items: [
          { label: "Achat / Vente immobilier", description: "Accompagnement complet acheteur & vendeur", icon: Home, href: "/services/achat-vente-immo" },
          { label: "Location immobilier", description: "Gestion locative clé en main", icon: Building2, href: "/services/location-immo" },
        ],
      },
    ],
  },
  { id: 4, label: "À propos de nous", link: "/about" },
  {
    id: 5,
    label: "Blog & Conseils",
    subMenus: [
      {
        title: "Catégories",
        items: [
          { label: "Tous les articles", description: "L'ensemble de nos publications", icon: BookOpen, href: "/blog" },
          { label: "Automobile", description: "Conseils, guides et tendances auto", icon: Car, href: "/blog/automobile" },
          { label: "Immobilier", description: "Investissement, achat et location", icon: Home, href: "/blog/immobilier" },
          { label: "Guides & Conseils", description: "Guides pratiques pour vos projets", icon: Info, href: "/blog/guides" },
          { label: "Actualités", description: "Les dernières nouvelles du marché", icon: Settings, href: "/blog/actualites" },
        ],
      },
    ],
  },
  { id: 6, label: "Annonces", link: "/annonces" },
  { id: 7, label: "Contact", link: "/contact" },
];

export const MOBILE_NAV_DEFAULT: MobileNavItem[] = [
  { label: "Accueil", href: "/", iconName: "Home" },
  { label: "Voitures à vendre", href: "/automobile/vente", iconName: "CarFront" },
  { label: "Location de voitures", href: "/automobile/location", iconName: "Key" },
  { label: "Pièces auto", href: "/automobile/pieces", iconName: "Settings" },
  { label: "Biens à vendre", href: "/immobilier/vente", iconName: "Home" },
  { label: "Biens en location", href: "/immobilier/location", iconName: "Building2" },
  { label: "Terrains", href: "/immobilier/terrains", iconName: "MapPin" },
  { label: "Toutes les annonces", href: "/annonces", iconName: "LayoutDashboard" },
  { label: "Blog", href: "/blog", iconName: "BookOpen" },
  { label: "Contact", href: "/contact", iconName: "Phone" },
  { label: "Publier une annonce", href: "/publier", iconName: "Plus" },
  { label: "Mon espace", href: "/dashboard", iconName: "LayoutDashboard" },
];

type RawNavItem = {
  id: number;
  label: string;
  link?: string;
  subMenus?: Array<{
    title: string;
    items: Array<{
      label: string;
      description?: string;
      iconName?: string;
      href: string;
    }>;
  }>;
};

export function parseNavJson(json: string): MegaMenuItem[] {
  try {
    const raw: RawNavItem[] = JSON.parse(json);
    return raw.map((item) => ({
      id: item.id,
      label: item.label,
      link: item.link,
      subMenus: item.subMenus?.map((sm) => ({
        title: sm.title,
        items: sm.items.map((si) => ({
          label: si.label,
          description: si.description || "",
          icon: resolveIcon(si.iconName || "Settings"),
          href: si.href,
        })),
      })),
    }));
  } catch {
    return NAV_ITEMS_DEFAULT;
  }
}

export function parseMobileNavJson(json: string): MobileNavItem[] {
  try {
    const raw = JSON.parse(json);
    if (Array.isArray(raw)) return raw;
    return MOBILE_NAV_DEFAULT;
  } catch {
    return MOBILE_NAV_DEFAULT;
  }
}
