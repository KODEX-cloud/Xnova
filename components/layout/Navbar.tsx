"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Home, Wrench, Info, BookOpen, Phone, User, Menu, X, ChevronDown,
  CarFront, Building2, Key, Layers, Settings, MapPin, Warehouse, Plus, LayoutDashboard,
} from "lucide-react";
import MegaMenu, { MegaMenuItem } from "@/components/ui/mega-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS: MegaMenuItem[] = [
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
  { id: 4, label: "À propos de nous", link: "#about" },
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

const MOBILE_NAV = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Voitures à vendre", href: "/automobile/vente", icon: CarFront },
  { label: "Location de voitures", href: "/automobile/location", icon: Key },
  { label: "Pièces auto", href: "/automobile/pieces", icon: Settings },
  { label: "Biens à vendre", href: "/immobilier/vente", icon: Home },
  { label: "Biens en location", href: "/immobilier/location", icon: Building2 },
  { label: "Terrains", href: "/immobilier/terrains", icon: MapPin },
  { label: "Toutes les annonces", href: "/annonces", icon: LayoutDashboard },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "Publier une annonce", href: "/publier", icon: Plus },
  { label: "Mon espace", href: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300",
          scrolled
            ? "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100/50"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-nova-red to-nova-orange rounded-xl rotate-6 group-hover:rotate-3 transition-transform duration-300 shadow-nova-sm" />
                <span className="relative text-white font-black text-lg z-10">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-nova-red font-black text-2xl tracking-tight">NOVA</span>
                <span className="text-gray-400 text-[9px] font-medium uppercase tracking-widest">Auto &amp; Immobilier</span>
              </div>
            </a>

            {/* Desktop MegaMenu */}
            <nav className="hidden lg:flex items-center flex-1 justify-center">
              <MegaMenu items={NAV_ITEMS} />
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeToggle />
              <a
                href="/publier"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-nova-red font-medium transition-colors duration-200 rounded-xl hover:bg-orange-50"
              >
                <Plus className="h-4 w-4" />
                <span>Publier</span>
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-nova-red font-medium transition-colors duration-200 rounded-xl hover:bg-orange-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Mon espace</span>
              </a>
              <a
                href="/contact"
                className="px-5 py-2.5 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white text-sm font-bold rounded-full transition-all duration-300 shadow-nova-sm hover:shadow-nova-md hover:scale-105"
              >
                Nous contacter
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-nova-red transition-colors rounded-xl hover:bg-orange-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu mobile"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

            {/* Panel */}
            <motion.div
              className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-100 flex flex-col pt-20 pb-8 px-6 overflow-y-auto shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col gap-1">
                {MOBILE_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-700 hover:text-nova-red hover:bg-orange-50 transition-all duration-200 group"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                        <Icon className="h-4 w-4 text-nova-red" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-3">
                <a
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:border-nova-red hover:text-nova-red transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Mon espace
                </a>
                <a
                  href="/publier"
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-nova-red to-nova-orange text-white text-sm font-bold rounded-full hover:shadow-nova-md transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  Publier une annonce
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
