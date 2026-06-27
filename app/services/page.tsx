"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Car, Home, Zap, Shield, Clock, Users } from "lucide-react";
import ServiceCard from "@/components/services/ServiceCard";
import { getServicesByCategory } from "@/lib/services-data";


const DEFAULTS: Record<string, string> = {
  "hero.badge":    "Nos services exclusifs",
  "hero.title1":   "Des services conçus",
  "hero.title2":   "pour votre confort",
  "hero.subtitle": "De la location de véhicule à la gestion immobilière, NOVA vous offre des solutions premium complètes à Abidjan.",
  "hero.hl1":      "Disponible 24h/24",
  "hero.hl2":      "Service garanti",
  "hero.hl3":      "Réponse en 2h",
  "hero.hl4":      "+500 clients satisfaits",
  "cta.title":     "Besoin d'un service sur mesure ?",
  "cta.subtitle":  "Notre équipe est disponible pour étudier votre demande et vous proposer une solution personnalisée.",
  "cta.btn":       "Parler à un expert",
  "cta.footer":    "Réponse garantie en moins de 2 heures",
};

export default function ServicesPage() {
  const autoServices = getServicesByCategory("automobile");
  const immoServices = getServicesByCategory("immobilier");
  const [c, setC] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=page.services.")
      .then(r => r.json())
      .then(data => setC(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const g = (key: string) => c[key] || DEFAULTS[key] || "";

  const highlights = [
    { Icon: Clock,  text: g("hero.hl1") },
    { Icon: Shield, text: g("hero.hl2") },
    { Icon: Zap,    text: g("hero.hl3") },
    { Icon: Users,  text: g("hero.hl4") },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-white via-orange-50 to-rose-50 border-b border-gray-100 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            <Zap className="h-3.5 w-3.5" /> {g("hero.badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight"
          >
            {g("hero.title1")}<br />
            <span className="gradient-text-nova">{g("hero.title2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto mb-10"
          >
            {g("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {highlights.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-500 text-sm">
                <Icon className="h-4 w-4 text-nova-red" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Automobile Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nova-red flex items-center justify-center shadow-sm">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-nova-red text-xs font-bold uppercase tracking-widest">Automobile</p>
                <h2 className="text-gray-900 font-bold text-2xl">Services auto</h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {autoServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </div>

        {/* Immobilier Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest">Immobilier</p>
                <h2 className="text-gray-900 font-bold text-2xl">Services immobiliers</h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {immoServices.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative rounded-3xl overflow-hidden p-12 text-center bg-gradient-to-br from-nova-red via-orange-500 to-nova-orange shadow-xl shadow-orange-200">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-3">{g("cta.title")}</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{g("cta.subtitle")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-nova-red font-bold rounded-full text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {g("cta.btn")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-white/60 text-sm mt-4">{g("cta.footer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
