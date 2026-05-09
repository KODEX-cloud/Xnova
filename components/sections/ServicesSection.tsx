"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCircle, Car, Layers, ArrowRight, Clock, Shield, Star } from "lucide-react";

const services = [
  {
    icon: UserCircle,
    title: "Réservez un Chauffeur",
    description: "Des chauffeurs professionnels et discrets disponibles 24h/24 et 7j/7 à Abidjan. Transferts aéroport, déplacements professionnels ou sorties de prestige.",
    features: ["Disponible 24h/24", "Chauffeurs certifiés", "Véhicules premium"],
    cta: "Réserver maintenant",
    href: "/services/location-voiture",
    iconBg: "bg-gradient-to-br from-nova-red to-nova-orange",
    tag: "Populaire",
    tagColor: "bg-orange-100 text-nova-red",
    accent: "border-orange-200",
    accentHover: "hover:border-orange-300 hover:shadow-orange-100",
  },
  {
    icon: Car,
    title: "Réservez un Véhicule",
    description: "Louez les plus belles voitures d'Abidjan pour vos événements, voyages d'affaires ou escapades. Large choix de SUV, berlines et véhicules de luxe.",
    features: ["Livraison incluse", "Assurance complète", "Sans engagement"],
    cta: "Choisir un véhicule",
    href: "/services/location-voiture",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-400",
    tag: "Flexible",
    tagColor: "bg-amber-100 text-amber-700",
    accent: "border-amber-200",
    accentHover: "hover:border-amber-300 hover:shadow-amber-100",
  },
  {
    icon: Layers,
    title: "Gestion de Flotte",
    description: "Confiez la gestion complète de votre flotte de véhicules à NOVA. Maintenance, suivi, renouvellement et optimisation des coûts pour entreprises.",
    features: ["Suivi en temps réel", "Maintenance incluse", "Rapport mensuel"],
    cta: "Demander un devis",
    href: "/services/flotte",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    tag: "Entreprise",
    tagColor: "bg-blue-100 text-blue-700",
    accent: "border-blue-200",
    accentHover: "hover:border-blue-300 hover:shadow-blue-100",
  },
];

const serviceHighlights = [
  { icon: Clock, text: "Disponible 24h/24" },
  { icon: Shield, text: "Assurance garantie" },
  { icon: Star, text: "Service 5 étoiles" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Nos services exclusifs
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          >
            Des services conçus pour{" "}<span className="gradient-text-nova">votre confort</span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            De la réservation de chauffeur à la gestion de flotte, NOVA s&apos;occupe de tout
          </motion.p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {serviceHighlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.text} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                  <Icon className="h-4 w-4 text-nova-red" />
                  {h.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                className={`group relative rounded-3xl p-8 bg-white border-2 ${service.accent} ${service.accentHover} hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <span className={`absolute top-5 right-5 px-2.5 py-1 rounded-full text-xs font-bold ${service.tagColor}`}>
                  {service.tag}
                </span>

                <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-nova-red transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.description}</p>

                <ul className="space-y-2 mb-8">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-nova-red flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={service.href}
                  className="flex items-center gap-2 text-nova-red font-bold text-sm transition-colors group/link hover:gap-3"
                >
                  {service.cta}
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-full text-base transition-all hover:shadow-xl hover:shadow-orange-300/50 hover:scale-105"
          >
            Discuter de vos besoins
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-gray-400 text-sm mt-4">Réponse garantie en moins de 2 heures</p>
        </motion.div>
      </div>
    </section>
  );
}
