import { Metadata } from "next";
import Link from "next/link";
import { Map, Car, Building2, Wrench, BookOpen, Phone, User, Info, HelpCircle, FileText, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Plan du site — NOVA Marketplace",
  description: "Retrouvez toutes les pages de NOVA Marketplace.",
};

const SECTIONS = [
  {
    title: "Automobile",
    icon: Car,
    links: [
      { label: "Toutes les voitures", href: "/automobile" },
      { label: "Voitures à vendre", href: "/automobile/vente" },
      { label: "Location de voitures", href: "/automobile/location" },
      { label: "Pièces auto", href: "/automobile/pieces" },
    ],
  },
  {
    title: "Immobilier",
    icon: Building2,
    links: [
      { label: "Tous les biens", href: "/immobilier" },
      { label: "Acheter un bien", href: "/immobilier/vente" },
      { label: "Louer un bien", href: "/immobilier/location" },
      { label: "Studios meublés", href: "/immobilier/studios" },
      { label: "Terrains", href: "/immobilier/terrains" },
    ],
  },
  {
    title: "Services",
    icon: Wrench,
    links: [
      { label: "Tous les services", href: "/services" },
      { label: "Location de voiture", href: "/services/location-voiture" },
      { label: "Achat / Vente immobilier", href: "/services/achat-vente-immo" },
      { label: "Location immobilier", href: "/services/location-immo" },
      { label: "Pièces auto", href: "/services/pieces-auto" },
      { label: "Gestion de flotte", href: "/services/flotte" },
    ],
  },
  {
    title: "Blog",
    icon: BookOpen,
    links: [
      { label: "Tous les articles", href: "/blog" },
      { label: "Automobile", href: "/blog/automobile" },
      { label: "Immobilier", href: "/blog/immobilier" },
      { label: "Guides & Conseils", href: "/blog/guides" },
      { label: "Actualités", href: "/blog/actualites" },
    ],
  },
  {
    title: "Mon compte",
    icon: User,
    links: [
      { label: "Toutes les annonces", href: "/annonces" },
      { label: "Publier une annonce", href: "/publier" },
      { label: "Mon espace", href: "/dashboard" },
    ],
  },
  {
    title: "Société",
    icon: Info,
    links: [
      { label: "À propos de nous", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Aide & Légal",
    icon: HelpCircle,
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "CGU", href: "/cgu" },
      { label: "Plan du site", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-5">
            <Map className="h-3.5 w-3.5" />
            Navigation
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Plan du site</h1>
          <p className="text-white/60 text-sm">Toutes les pages de NOVA Marketplace</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-800">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-nova-red transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-nova-red transition-colors flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
