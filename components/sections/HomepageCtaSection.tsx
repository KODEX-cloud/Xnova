"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { HomepageConfig } from "@/lib/homepage-keys";
import { getContrastColor } from "@/lib/utils/contrast";

export default function HomepageCtaSection({ config }: { config: HomepageConfig }) {
  const bgColor = config.ctaBg || "#F97316";
  const textColor = getContrastColor(bgColor) === "#FFFFFF" ? "text-white" : "text-gray-900";
  const subColor = getContrastColor(bgColor) === "#FFFFFF" ? "text-white/70" : "text-gray-700";

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)` }}
      />
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {config.ctaLabel || "Rejoignez NOVA"}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-3xl md:text-5xl font-black leading-tight mb-6 ${textColor}`}
        >
          {config.ctaTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className={`text-lg leading-relaxed mb-10 max-w-2xl mx-auto ${subColor}`}
        >
          {config.ctaSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {config.ctaBtn1Text && (
            <Link
              href={config.ctaBtn1Link}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-base transition-all hover:shadow-2xl hover:scale-105 group"
            >
              {config.ctaBtn1Text}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {config.ctaBtn2Text && (
            <Link
              href={config.ctaBtn2Link}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-base transition-all hover:bg-white/25 hover:border-white/60 hover:scale-105 group"
            >
              {config.ctaBtn2Text}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
