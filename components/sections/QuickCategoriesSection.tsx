"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CarFront, Key, Home, Building2, MapPin, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    icon: CarFront,
    label: "Acheter une voiture",
    description: "Neuves et occasions",
    href: "/automobile/vente",
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-orange-200/80",
    badge: "1 200+ offres",
    badgeColor: "text-orange-600 bg-orange-50",
    hoverBorder: "hover:border-orange-200",
    bg: "from-orange-50/80 to-white",
  },
  {
    icon: Key,
    label: "Louer une voiture",
    description: "Dès 25 000 CFA/jour",
    href: "/automobile/location",
    gradient: "from-amber-500 to-orange-400",
    glow: "shadow-amber-200/80",
    badge: "Courte durée",
    badgeColor: "text-amber-700 bg-amber-50",
    hoverBorder: "hover:border-amber-200",
    bg: "from-amber-50/80 to-white",
  },
  {
    icon: Home,
    label: "Acheter une maison",
    description: "Villas, appartements",
    href: "/immobilier/vente",
    gradient: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-200/80",
    badge: "500+ biens",
    badgeColor: "text-blue-700 bg-blue-50",
    hoverBorder: "hover:border-blue-200",
    bg: "from-blue-50/80 to-white",
  },
  {
    icon: Building2,
    label: "Louer un bien",
    description: "Meublé & non meublé",
    href: "/immobilier/location",
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-200/80",
    badge: "Longue durée",
    badgeColor: "text-emerald-700 bg-emerald-50",
    hoverBorder: "hover:border-emerald-200",
    bg: "from-emerald-50/80 to-white",
  },
  {
    icon: MapPin,
    label: "Acheter un terrain",
    description: "Titres fonciers sécurisés",
    href: "/immobilier/terrains",
    gradient: "from-purple-500 to-violet-500",
    glow: "shadow-purple-200/80",
    badge: "Titres fonciers",
    badgeColor: "text-purple-700 bg-purple-50",
    hoverBorder: "hover:border-purple-200",
    bg: "from-purple-50/80 to-white",
  },
];

export default function QuickCategoriesSection() {
  return (
    <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.span
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Catégories
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-black text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Que recherchez-vous ?
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Sélectionnez une catégorie pour démarrer votre recherche
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  href={cat.href}
                  className={`group flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b ${cat.bg} border-2 border-gray-100 ${cat.hoverBorder} hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden`}
                >
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

                  {/* Icon */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${cat.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/15 rounded-t-2xl" />
                    </div>
                  </div>

                  <h3 className="text-gray-800 font-bold text-sm leading-tight mb-1.5">{cat.label}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{cat.description}</p>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cat.badgeColor} mt-auto mb-3`}>
                    {cat.badge}
                  </span>

                  <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-700 text-xs font-semibold transition-colors">
                    Explorer <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
