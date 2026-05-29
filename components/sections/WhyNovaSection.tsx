"use client";

import { motion } from "framer-motion";
import type { HomepageConfig } from "@/lib/homepage-keys";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-keys";
import DynamicLucideIcon from "@/components/ui/DynamicLucideIcon";

export default function WhyNovaSection({ config }: { config?: HomepageConfig }) {
  const benefitsList = config?.whyNova || HOMEPAGE_DEFAULTS.whyNova;
  const title = config?.whyNovaTitle || HOMEPAGE_DEFAULTS.whyNovaTitle;
  const subtitle = config?.whyNovaSubtitle || HOMEPAGE_DEFAULTS.whyNovaSubtitle;

  return (
    <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Pourquoi NOVA ?
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {title.split("vous").length > 1 ? (
              <>
                {title.split("vous")[0].trim()} vous{" "}
                <span className="gradient-text-nova">
                  {title.split("vous")[1].trim()}
                </span>
              </>
            ) : title}
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {benefitsList.map((b, i) => {
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                whileHover={{ y: -8 }}
                className={`group relative p-7 rounded-3xl bg-white border-2 ${b.border} ${b.hoverBorder} hover:shadow-2xl ${b.hoverShadow} transition-all duration-300 cursor-default overflow-hidden`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-400`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <DynamicLucideIcon name={b.icon} className="h-7 w-7 text-white" />
                  {/* Gloss */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-2xl" />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-gray-900 font-black text-lg leading-tight group-hover:text-gray-800 transition-colors">
                    {b.title}
                  </h3>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${b.chip.bg} ${b.chip.text}`}>
                    {b.chip.label}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
