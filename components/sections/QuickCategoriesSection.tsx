"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { HomepageConfig } from "@/lib/homepage-keys";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-keys";
import DynamicLucideIcon from "@/components/ui/DynamicLucideIcon";

export default function QuickCategoriesSection({ config }: { config?: HomepageConfig }) {
  const categoriesList = config?.categories || HOMEPAGE_DEFAULTS.categories;
  const title = config?.categoriesTitle || HOMEPAGE_DEFAULTS.categoriesTitle;
  const subtitle = config?.categoriesSubtitle || HOMEPAGE_DEFAULTS.categoriesSubtitle;

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
            {title.split("?").length > 1 ? (
              <>
                {title.split("?")[0].trim()}{" "}
                <span className="gradient-text-nova">?</span>
              </>
            ) : title}
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {categoriesList.map((cat, i) => {
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
                    <DynamicLucideIcon name={cat.icon} className="h-8 w-8 text-white" />
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
