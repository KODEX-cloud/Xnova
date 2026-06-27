"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone, PhoneCall, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const PERKS = [
  "Publication en 5 minutes",
  "Visibilité immédiate",
  "Accompagnement d'un expert",
  "100% gratuit pour commencer",
];

export default function SellCTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-nova-red via-orange-500 to-nova-orange" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 px-8 py-14 md:px-14 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex items-center gap-2 mb-5"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30">
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Pour les vendeurs</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-black text-white leading-tight mb-4"
              >
                Vous avez un bien<br />à vendre ?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="text-white/80 text-lg mb-8 max-w-xl"
              >
                Publiez votre annonce automobile ou immobilière en quelques clics et touchez des milliers d'acheteurs qualifiés.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                {PERKS.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/90 flex-shrink-0" />
                    <span className="text-white/90 text-sm font-medium">{p}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="flex flex-col gap-4 min-w-[260px]"
            >
              <Link
                href="/publier"
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-nova-red font-black text-base hover:bg-white/95 transition-all hover:shadow-2xl hover:scale-[1.02] group"
              >
                <Megaphone className="h-5 w-5" />
                Publier une annonce
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-base transition-all hover:shadow-xl group"
              >
                <PhoneCall className="h-5 w-5" />
                Contacter un agent
              </Link>
              <p className="text-white/60 text-xs text-center">Réponse garantie sous 2h ouvrables</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
