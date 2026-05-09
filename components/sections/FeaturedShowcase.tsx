"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ScrollExpandMedia from "@/components/ui/scroll-expansion";
import { CheckCircle2, Star, MapPin, ArrowRight } from "lucide-react";

const showcaseFeatures = [
  "Architecture contemporaine haut de gamme",
  "Piscine à débordement vue sur jardin paysager",
  "5 chambres avec dressing, 4 salles de bain luxueuses",
  "Cuisine équipée et salon de 120 m²",
  "Système domotique intégré, sécurité 24h/24",
  "Garage double avec parvis sécurisé",
  "Quartier Riviera Golf — Cocody, Abidjan",
];

function ShowcaseContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-nova-red" />
            <span className="text-nova-red font-semibold text-sm">
              Cocody Riviera Golf, Abidjan
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Une propriété d&apos;exception au coeur de Cocody
          </h3>
          <p className="text-white/60 leading-relaxed mb-6">
            Cette villa de prestige représente le summum du luxe immobilier en Côte
            d&apos;Ivoire. Nichée dans le quartier résidentiel le plus exclusif d&apos;Abidjan, elle
            offre une vue imprenable sur la lagune et bénéficie de toutes les
            finitions les plus raffinées.
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-nova-yellow text-nova-yellow" />
            ))}
            <span className="text-white font-bold">5.0</span>
            <span className="text-white/40 text-sm">• Propriété certifiée NOVA</span>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-full text-sm hover:shadow-xl hover:shadow-nova-red/30 hover:scale-105 transition-all duration-300 group"
          >
            Visiter cette propriété
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Right: Features */}
        <div>
          <p className="text-nova-red font-semibold text-sm uppercase tracking-wider mb-4">
            Caractéristiques
          </p>
          <ul className="space-y-3">
            {showcaseFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-nova-red flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="mt-8 p-5 rounded-2xl bg-nova-navy border border-white/5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
              Prix de vente
            </p>
            <p className="text-nova-red font-black text-3xl">
              485 000 000 CFA
            </p>
            <p className="text-white/40 text-xs mt-1">
              Financement facilité disponible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedShowcase() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative">
      {/* Section Label */}
      <div className="absolute top-0 left-0 right-0 z-30 text-center pt-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-nova-dark/80 backdrop-blur border border-nova-red/30 text-nova-red text-xs font-bold uppercase tracking-widest">
            Propriété vedette
          </span>
        </motion.div>
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
        bgImageSrc="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
        title="Villa Prestige"
        date="Cocody Riviera"
        scrollToExpand="↓ Faites défiler pour découvrir"
        textBlend={false}
      >
        <ShowcaseContent />
      </ScrollExpandMedia>
    </section>
  );
}
