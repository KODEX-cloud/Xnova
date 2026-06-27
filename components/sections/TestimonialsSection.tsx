"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { Star } from "lucide-react";

interface Testimonial {
  id: string; content: string; author: string; role: string; avatar: string; rating: number;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Témoignages clients
          </motion.span>
          <motion.h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Ils nous font <span className="gradient-text-nova">confiance</span>
          </motion.h2>
          <motion.p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Des milliers de clients satisfaits à Abidjan et dans toute la Côte d&apos;Ivoire témoignent de leur expérience avec NOVA
          </motion.p>
          <motion.div className="flex items-center justify-center gap-2 mb-2"
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />)}
            <span className="text-gray-900 font-black text-xl ml-2">4.9</span>
          </motion.div>
          <p className="text-gray-400 text-sm">Basé sur 1 247 avis vérifiés</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <StaggerTestimonials initialData={testimonials} />
        </motion.div>

        <motion.div className="mt-12 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          {[
            { label: "Satisfaction client", value: "98%" },
            { label: "Recommandations", value: "96%" },
            { label: "Délai de réponse", value: "< 2h" },
            { label: "Annonces vérifiées", value: "100%" },
          ].map(badge => (
            <div key={badge.label}
              className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-default">
              <span className="text-2xl font-black text-nova-red mb-1">{badge.value}</span>
              <span className="text-gray-500 text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
