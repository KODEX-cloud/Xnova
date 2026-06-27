"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Star, Zap, Target, Users, Car, Building2 } from "lucide-react";

const DEFAULTS: Record<string, string> = {
  "hero.title":    "À propos de NOVA",
  "hero.subtitle": "Votre partenaire de confiance pour l'automobile et l'immobilier en Côte d'Ivoire.",
  "story.title":   "Notre histoire",
  "story.text":    "NOVA est née de la vision de créer un marketplace premium qui réunit acheteurs et vendeurs dans les secteurs de l'automobile et de l'immobilier en Côte d'Ivoire. Fondée à Abidjan, notre plateforme connecte des milliers de clients avec les meilleures opportunités du marché.",
  "mission.title": "Notre mission",
  "mission.text":  "Faciliter l'accès aux meilleures offres automobiles et immobilières en Côte d'Ivoire, en proposant une plateforme transparente, sécurisée et facile à utiliser pour tous.",
  "values.title":    "Nos valeurs",
  "values.v1.label": "Excellence",
  "values.v1.text":  "Nous nous engageons à offrir uniquement des services et des annonces de la plus haute qualité.",
  "values.v2.label": "Confiance",
  "values.v2.text":  "Chaque transaction est sécurisée et transparente pour vous permettre d'agir en toute sérénité.",
  "values.v3.label": "Innovation",
  "values.v3.text":  "Nous innovons constamment pour vous offrir les meilleurs outils de recherche et de mise en relation.",
  "cta.title":    "Rejoignez la famille NOVA",
  "cta.subtitle": "Des milliers de clients font déjà confiance à NOVA pour leurs projets automobile et immobilier en Côte d'Ivoire.",
  "cta.btn":      "Nous contacter",
};

const VALUE_ICONS = [Heart, Star, Zap];

const STATS = [
  { icon: Car,       value: "1 200+", label: "Voitures disponibles" },
  { icon: Building2, value: "800+",   label: "Biens immobiliers" },
  { icon: Users,     value: "5 000+", label: "Clients satisfaits" },
  { icon: Target,    value: "4.9/5",  label: "Note moyenne" },
];

export default function AboutPage() {
  const [c, setC] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=page.about.")
      .then(r => r.json())
      .then(data => setC(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const g = (key: string) => c[key] || DEFAULTS[key] || "";

  const values = [
    { icon: VALUE_ICONS[0], label: g("values.v1.label"), text: g("values.v1.text") },
    { icon: VALUE_ICONS[1], label: g("values.v2.label"), text: g("values.v2.text") },
    { icon: VALUE_ICONS[2], label: g("values.v3.label"), text: g("values.v3.text") },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-white via-orange-50 to-rose-50 border-b border-gray-100 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            <Users className="h-3.5 w-3.5" /> À propos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight"
          >
            {g("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            {g("hero.subtitle")}
          </motion.p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-nova-red" />
              </div>
              <p className="text-gray-900 font-black text-2xl">{value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Notre histoire */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <p className="text-nova-red text-xs font-bold uppercase tracking-widest mb-2">Notre histoire</p>
            <h2 className="text-gray-900 font-black text-3xl mb-5">{g("story.title")}</h2>
            <p className="text-gray-500 text-base leading-relaxed whitespace-pre-line">{g("story.text")}</p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200">
                  <span className="text-white font-black text-4xl">N</span>
                </div>
                <p className="text-gray-600 font-bold text-lg">NOVA Marketplace</p>
                <p className="text-gray-400 text-sm">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notre mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gray-50 border border-gray-100 p-10 md:p-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-nova-red/10 flex items-center justify-center mx-auto mb-5">
              <Target className="h-6 w-6 text-nova-red" />
            </div>
            <p className="text-nova-red text-xs font-bold uppercase tracking-widest mb-2">Mission</p>
            <h2 className="text-gray-900 font-black text-3xl mb-5">{g("mission.title")}</h2>
            <p className="text-gray-500 text-lg leading-relaxed">{g("mission.text")}</p>
          </div>
        </motion.div>

        {/* Nos valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <p className="text-nova-red text-xs font-bold uppercase tracking-widest mb-2">Valeurs</p>
            <h2 className="text-gray-900 font-black text-3xl">{g("values.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, label, text }) => (
              <div key={label} className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center mb-5 shadow-md shadow-orange-200">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-3">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-12 text-center bg-gradient-to-br from-nova-red via-orange-500 to-nova-orange shadow-xl shadow-orange-200"
        >
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
