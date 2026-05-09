"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Car, Home, ArrowRight, CheckCircle2, Zap, Shield, Clock,
} from "lucide-react";

const CARDS = [
  {
    icon: Car,
    title: "Publier une voiture",
    description: "Vendez ou proposez à la location votre véhicule — BMW, Mercedes, Toyota et toutes marques.",
    href: "/publier/automobile",
    perks: ["Visible en moins de 24h", "Photos incluses", "Gestion simple"],
    gradient: "from-nova-red/20 via-nova-orange/10 to-transparent",
    iconBg: "bg-nova-red",
    border: "hover:border-nova-red/30",
    cta: "Publier un véhicule",
    ctaClass: "bg-nova-red hover:bg-nova-red/90 shadow-nova-red/30",
  },
  {
    icon: Home,
    title: "Publier un bien immobilier",
    description: "Vendez ou louez votre maison, villa, terrain ou studio à Abidjan et partout en Côte d'Ivoire.",
    href: "/publier/immobilier",
    perks: ["Visibilité maximale", "Photos HD", "Mise en avant possible"],
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    iconBg: "bg-blue-500",
    border: "hover:border-blue-500/30",
    cta: "Publier un bien",
    ctaClass: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
  },
];

const HOW = [
  { icon: Zap, label: "1. Remplissez le formulaire", desc: "Titre, description, photos — 5 minutes suffisent." },
  { icon: Shield, label: "2. Choisissez votre offre", desc: "Publication gratuite ou mise en avant premium." },
  { icon: Clock, label: "3. Votre annonce est en ligne", desc: "Visible par des milliers d'acheteurs qualifiés." },
];

export default function PublierPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="section-label"
        >
          <Zap className="h-3.5 w-3.5" /> Publier une annonce
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black text-gray-900 mb-4"
        >
          Que souhaitez-vous <span className="gradient-text-nova">publier ?</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-gray-500 text-lg"
        >
          Choisissez le type d'annonce pour commencer votre publication
        </motion.p>
      </div>

      {/* Choice cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <Link href={card.href}
                className={`group flex flex-col h-full p-8 rounded-3xl bg-white border-2 border-gray-100 ${card.border} transition-all duration-300 hover:shadow-xl`}>
                {/* Icon */}
                <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-gray-900 font-black text-2xl mb-3">{card.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{card.description}</p>

                {/* Perks */}
                <ul className="space-y-2 mb-8 flex-1">
                  {card.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-gray-600 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl ${card.ctaClass} text-white font-bold text-sm transition-all hover:shadow-lg group/btn`}>
                  {card.cta}
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-gray-900 font-black text-xl text-center mb-8">Comment ça marche ?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-nova-red/15 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-nova-red" />
                </div>
                <p className="text-gray-800 font-bold text-sm mb-2">{step.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
