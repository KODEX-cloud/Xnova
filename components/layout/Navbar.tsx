"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Plus, LayoutDashboard,
} from "lucide-react";
import MegaMenu, { MegaMenuItem } from "@/components/ui/mega-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  NAV_ITEMS_DEFAULT, MOBILE_NAV_DEFAULT, MobileNavItem,
  parseNavJson, parseMobileNavJson,
} from "@/lib/nav-defaults";
import { resolveIcon } from "@/lib/icon-map";

interface NavSettings {
  logoUrl?: string;
  logoText?: string;
  logoTagline?: string;
  navCtaText?: string;
  navCtaHref?: string;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState<MegaMenuItem[]>(NAV_ITEMS_DEFAULT);
  const [mobileNav, setMobileNav] = useState<MobileNavItem[]>(MOBILE_NAV_DEFAULT);
  const [brand, setBrand] = useState<NavSettings>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings?prefix=nav.")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data["megamenu"]) setNavItems(parseNavJson(data["megamenu"]));
        if (data["mobilemenu"]) setMobileNav(parseMobileNavJson(data["mobilemenu"]));
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setBrand({
          logoUrl: data.logoUrl || data.logo || "",
          logoText: data.logoText || "NOVA",
          logoTagline: data.logoTagline || "Auto & Immobilier",
          navCtaText: data.navCtaText || "Nous contacter",
          navCtaHref: data.navCtaHref || "/contact",
        });
      })
      .catch(() => {});
  }, []);

  const logoText = brand.logoText || "NOVA";
  const logoTagline = brand.logoTagline || "Auto & Immobilier";
  const ctaText = brand.navCtaText || "Nous contacter";
  const ctaHref = brand.navCtaHref || "/contact";

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
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoUrl} alt={logoText} className="h-9 w-auto object-contain" />
              ) : (
                <>
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-nova-red to-nova-orange rounded-xl rotate-6 group-hover:rotate-3 transition-transform duration-300 shadow-nova-sm" />
                    <span className="relative text-white font-black text-lg z-10">
                      {logoText.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-nova-red font-black text-2xl tracking-tight">{logoText}</span>
                    <span className="text-gray-400 text-[9px] font-medium uppercase tracking-widest">{logoTagline}</span>
                  </div>
                </>
              )}
            </a>

            {/* Desktop MegaMenu */}
            <nav className="hidden lg:flex items-center flex-1 justify-center">
              <MegaMenu items={navItems} />
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
                href={ctaHref}
                className="px-5 py-2.5 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white text-sm font-bold rounded-full transition-all duration-300 shadow-nova-sm hover:shadow-nova-md hover:scale-105"
              >
                {ctaText}
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
                {mobileNav.map((item) => {
                  const Icon = resolveIcon(item.iconName);
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
