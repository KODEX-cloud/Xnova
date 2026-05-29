"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import type { HomepageConfig } from "@/lib/homepage-keys";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-keys";
import DynamicLucideIcon from "@/components/ui/DynamicLucideIcon";

function Counter({ value, suffix, isDecimal, run }: { value: number; suffix: string; isDecimal?: boolean; run: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!run) return;
    let raf: number;
    const start = performance.now();
    const duration = 1800;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = eased * value;
      setDisplay(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value, isDecimal]);

  return (
    <span>{isDecimal ? display.toFixed(1) : display.toLocaleString("fr-FR")}{suffix}</span>
  );
}

export default function StatsSection({ config }: { config?: HomepageConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const statsList = config?.stats || HOMEPAGE_DEFAULTS.stats;
  const title = config?.statsTitle || HOMEPAGE_DEFAULTS.statsTitle;
  const subtitle = config?.statsSubtitle || HOMEPAGE_DEFAULTS.statsSubtitle;

  return (
    <section className="relative py-20 lg:py-28 bg-[#0D1117] overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-nova-red/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-blue-500/6 rounded-full blur-[100px]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={inView ? { opacity: 1, y: 0 } : {}}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nova-orange text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Star className="h-3.5 w-3.5 fill-nova-orange" />
            NOVA en chiffres
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            {title.split(",").length > 1 ? (
              <>
                {title.split(",")[0].trim()},{" "}
                <span className="bg-gradient-to-r from-nova-red via-nova-orange to-amber-400 bg-clip-text text-transparent">
                  {title.split(",")[1].trim()}
                </span>
              </>
            ) : title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {statsList.map((s, i) => {
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-default overflow-hidden"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <DynamicLucideIcon name={s.icon} className="h-6 w-6 text-white" />
                </div>

                {/* Number */}
                <div className={`text-3xl lg:text-4xl font-black mb-1 bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                  <Counter value={s.value} suffix={s.suffix} isDecimal={s.isDecimal} run={inView} />
                </div>

                <p className="text-white font-semibold text-sm mb-1">{s.label}</p>
                <p className="text-white/35 text-xs leading-relaxed">{s.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom separator */}
        <motion.div
          className="mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/40 text-xs font-medium">Données mises à jour en temps réel</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
