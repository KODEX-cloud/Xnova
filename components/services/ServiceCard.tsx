"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ServiceData } from "@/lib/services-data";

export default function ServiceCard({ service, index = 0 }: { service: ServiceData; index?: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="group relative rounded-3xl border border-white/5 hover:border-white/10 overflow-hidden transition-all duration-400 hover:shadow-2xl hover:shadow-black/40 cursor-pointer"
      style={{ background: "rgba(17,24,39,0.7)", backdropFilter: "blur(20px)" }}
    >
      {/* Hover gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/20 to-transparent" />

        {/* Tag */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${service.tagColor}`}>
          {service.tag}
        </span>

        {/* Icon */}
        <div className={`absolute bottom-3 left-4 w-12 h-12 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
          {service.category === "automobile" ? "Automobile" : "Immobilier"}
        </p>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-nova-red transition-colors duration-200">
          {service.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">
          {service.shortDescription}
        </p>

        {/* Features */}
        <ul className="space-y-1.5 mb-6">
          {service.features.slice(0, 3).map(f => (
            <li key={f} className="flex items-center gap-2 text-xs text-white/60">
              <CheckCircle2 className="h-3.5 w-3.5 text-nova-red flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={`/services/${service.id}`}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-nova-red/20 border border-white/5 hover:border-nova-red/30 text-white/70 hover:text-nova-red text-sm font-semibold transition-all duration-200 group/btn"
        >
          {service.cta}
          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
