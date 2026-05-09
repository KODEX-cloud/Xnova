"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Tag, Clock, Zap } from "lucide-react";

interface Promotion {
  id: string; title: string; subtitle: string; description: string;
  image: string; badge: string; discount: string; cta: string;
  countdown: string; gradient: string;
}

const FALLBACK_PROMOS: Promotion[] = [
  {
    id: "1", badge: "Offre limitée", title: "Location longue durée",
    subtitle: "3 mois pour le prix de 2",
    description: "Profitez de notre promotion exceptionnelle sur la location longue durée de véhicules.",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    cta: "En profiter", discount: "-33%", countdown: "15 jours restants",
    gradient: "from-nova-red to-nova-orange",
  },
  {
    id: "2", badge: "Nouveau", title: "Villas Cocody Riviera",
    subtitle: "Financement facilité",
    description: "Accédez à nos villas de prestige avec un apport minimum.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    cta: "Découvrir", discount: "0%", countdown: "Offre spéciale",
    gradient: "from-nova-orange to-nova-yellow",
  },
];

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetch("/api/promotions")
      .then(r => r.json())
      .then(data => setPromotions(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROMOS))
      .catch(() => setPromotions(FALLBACK_PROMOS));
  }, []);

  const mainPromos = promotions.slice(0, 2);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Promotions & Offres
            </motion.span>
            <motion.h2 className="text-3xl md:text-4xl font-black text-gray-900"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              Saisir les meilleures <span className="gradient-text-nova">opportunités</span>
            </motion.h2>
          </div>
          <motion.a href="#" className="flex items-center gap-2 text-nova-red hover:text-nova-orange font-bold text-sm transition-colors group self-start md:self-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Toutes les promotions <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainPromos.map((promo, index) => {
            const gradient = promo.gradient || "from-nova-red to-nova-orange";
            const img = promo.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";
            return (
              <motion.div key={promo.id}
                className="relative overflow-hidden rounded-3xl group shadow-xl"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.01 }}>
                <div className="relative h-72">
                  <Image src={img} alt={promo.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-bold">
                        <Tag className="h-3 w-3" />{promo.badge}
                      </span>
                      {promo.countdown && (
                        <span className="flex items-center gap-1.5 text-white/70 text-xs">
                          <Clock className="h-3 w-3" />{promo.countdown}
                        </span>
                      )}
                    </div>
                    {promo.discount && promo.discount !== "0%" && (
                      <div className={`inline-flex items-center gap-1 mb-3 px-4 py-2 rounded-2xl bg-gradient-to-r ${gradient} text-white font-black text-2xl shadow-lg`}>
                        <Zap className="h-5 w-5" />{promo.discount}
                      </div>
                    )}
                    <h3 className="text-2xl font-black text-white mb-1">{promo.title}</h3>
                    <p className="text-orange-300 font-semibold mb-3">{promo.subtitle}</p>
                    <p className="text-white/70 text-sm leading-relaxed max-w-xs">{promo.description}</p>
                  </div>
                  <a href="#"
                    className={`self-start flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-full text-sm hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn`}>
                    {promo.cta || "En savoir plus"}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
