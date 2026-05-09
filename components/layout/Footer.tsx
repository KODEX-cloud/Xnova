"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";

const footerLinks = {
  automobile: {
    title: "Automobile",
    links: [
      { label: "Vente de voitures", href: "/automobile/vente" },
      { label: "Location de voitures", href: "/automobile/location" },
      { label: "Gestion de flotte", href: "/services/flotte" },
      { label: "Vente de pièces auto", href: "/services/pieces-auto" },
      { label: "Toutes les annonces", href: "/annonces" },
    ],
  },
  immobilier: {
    title: "Immobilier",
    links: [
      { label: "Vente de maisons", href: "/immobilier/vente" },
      { label: "Location de maisons", href: "/immobilier/location" },
      { label: "Vente de terrains", href: "/immobilier/terrains" },
      { label: "Studios meublés", href: "/immobilier/studios" },
      { label: "Toutes les annonces", href: "/annonces" },
    ],
  },
  societe: {
    title: "Société",
    links: [
      { label: "À propos de nous", href: "/a-propos" },
      { label: "Blog & Conseils", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Publier une annonce", href: "/publier" },
      { label: "Mon espace", href: "/dashboard" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contactez-nous", href: "/contact" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Conditions d'utilisation", href: "/cgu" },
      { label: "Plan du site", href: "/sitemap" },
    ],
  },
};

const cities = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Treichville", "San-Pédro"];

interface SiteInfo {
  siteName: string;
  footerTagline: string;
  footerCopyright: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

const DEFAULTS: SiteInfo = {
  siteName: "NOVA Marketplace",
  footerTagline: "Votre partenaire premium en automobile et immobilier en Côte d'Ivoire.",
  footerCopyright: "NOVA Marketplace. Tous droits réservés.",
  phone: "+225 07 00 00 00 00",
  email: "contact@nova.ci",
  address: "Cocody, Abidjan, Côte d'Ivoire",
  facebook: "https://facebook.com/novaci",
  instagram: "https://instagram.com/nova.ci",
  twitter: "",
  youtube: "",
};

export default function Footer() {
  const [info, setInfo] = useState<SiteInfo>(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setInfo((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const socialLinks = [
    info.facebook && { icon: Facebook, href: info.facebook, label: "Facebook", color: "hover:text-blue-600 hover:border-blue-200" },
    info.instagram && { icon: Instagram, href: info.instagram, label: "Instagram", color: "hover:text-pink-600 hover:border-pink-200" },
    info.twitter && { icon: Twitter, href: info.twitter, label: "Twitter", color: "hover:text-sky-500 hover:border-sky-200" },
    info.youtube && { icon: Youtube, href: info.youtube, label: "YouTube", color: "hover:text-red-600 hover:border-red-200" },
  ].filter(Boolean) as { icon: React.ElementType; href: string; label: string; color: string }[];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-nova-red to-nova-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Restez informé des meilleures offres</h3>
              <p className="text-white/80 text-sm">Recevez en avant-première nos annonces exclusives et conseils immobiliers & auto</p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 lg:w-72 px-4 py-3 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30 transition-all"
              />
              <button className="px-6 py-3 bg-white text-nova-red font-bold rounded-full text-sm transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                S&apos;inscrire <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-nova-red to-nova-orange rounded-xl rotate-6 group-hover:rotate-3 transition-transform duration-300 shadow-nova-sm" />
                <span className="relative text-white font-black text-lg z-10">N</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-nova-red font-black text-2xl tracking-tight">NOVA</span>
                <span className="text-gray-400 text-[9px] font-medium uppercase tracking-widest">Auto &amp; Immobilier</span>
              </div>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">{info.footerTagline}</p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {info.phone && (
                <a href={`tel:${info.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-nova-red transition-colors group">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4 text-nova-red" />
                  </div>
                  {info.phone}
                </a>
              )}
              {info.email && (
                <a href={`mailto:${info.email}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-nova-red transition-colors group">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors flex-shrink-0">
                    <Mail className="h-4 w-4 text-nova-red" />
                  </div>
                  {info.email}
                </a>
              )}
              {info.address && (
                <div className="flex items-start gap-3 text-sm text-gray-500">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-nova-red" />
                  </div>
                  <span>{info.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-200 hover:scale-110 ${social.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-nova-red transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200">
                        <ArrowRight className="h-3 w-3 flex-shrink-0" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cities */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">Villes desservies</p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/annonces?city=${encodeURIComponent(city)}`}
                className="px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-500 hover:border-nova-red/50 hover:text-nova-red hover:bg-orange-50 transition-all duration-200"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} {info.footerCopyright}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-nova-red animate-pulse" />
              <span className="text-gray-400 text-xs">Côte d&apos;Ivoire — Abidjan</span>
            </div>
            <div className="flex gap-4">
              <Link href="/confidentialite" className="text-gray-400 text-xs hover:text-nova-red transition-colors">Confidentialité</Link>
              <Link href="/cgu" className="text-gray-400 text-xs hover:text-nova-red transition-colors">CGU</Link>
              <Link href="/cookies" className="text-gray-400 text-xs hover:text-nova-red transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
