"use client";

import { motion } from "framer-motion";
import { ShieldCheck, LayoutGrid, Headphones, BadgeCheck, TrendingUp, Clock } from "lucide-react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Transactions sécurisées",
    description: "Chaque annonce est vérifiée par notre équipe. Vos paiements et données sont protégés à chaque étape.",
    gradient: "from-emerald-500 to-teal-500",
    accent: "bg-emerald-50",
    border: "border-emerald-100",
    hoverBorder: "hover:border-emerald-200",
    hoverShadow: "hover:shadow-emerald-100/60",
    chip: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Sécurisé" },
  },
  {
    icon: LayoutGrid,
    title: "Large choix de biens",
    description: "Plus de 2 000 annonces automobile et immobilier, mises à jour quotidiennement pour ne rater aucune offre.",
    gradient: "from-blue-500 to-indigo-500",
    accent: "bg-blue-50",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-200",
    hoverShadow: "hover:shadow-blue-100/60",
    chip: { bg: "bg-blue-100", text: "text-blue-700", label: "2 000+ offres" },
  },
  {
    icon: Headphones,
    title: "Support client rapide",
    description: "Notre équipe répond en moins de 2 heures. Disponible 7j/7 par WhatsApp, téléphone et chat en ligne.",
    gradient: "from-nova-red to-nova-orange",
    accent: "bg-orange-50",
    border: "border-orange-100",
    hoverBorder: "hover:border-orange-200",
    hoverShadow: "hover:shadow-orange-100/60",
    chip: { bg: "bg-orange-100", text: "text-nova-red", label: "Réponse < 2h" },
  },
  {
    icon: BadgeCheck,
    title: "Offres 100% vérifiées",
    description: "Chaque annonce est contrôlée par nos équipes. Aucune arnaque, aucune fausse offre n'est tolérée.",
    gradient: "from-nova-orange to-amber-400",
    accent: "bg-amber-50",
    border: "border-amber-100",
    hoverBorder: "hover:border-amber-200",
    hoverShadow: "hover:shadow-amber-100/60",
    chip: { bg: "bg-amber-100", text: "text-amber-700", label: "Anti-arnaque" },
  },
  {
    icon: TrendingUp,
    title: "Meilleurs prix du marché",
    description: "Nos experts négocient pour vous obtenir les meilleures conditions d'achat ou de location en CI.",
    gradient: "from-purple-500 to-violet-500",
    accent: "bg-purple-50",
    border: "border-purple-100",
    hoverBorder: "hover:border-purple-200",
    hoverShadow: "hover:shadow-purple-100/60",
    chip: { bg: "bg-purple-100", text: "text-purple-700", label: "Prix négocié" },
  },
  {
    icon: Clock,
    title: "Processus ultra-rapide",
    description: "De la recherche à la signature — nous optimisons chaque étape pour vous faire gagner un temps précieux.",
    gradient: "from-rose-500 to-pink-500",
    accent: "bg-rose-50",
    border: "border-rose-100",
    hoverBorder: "hover:border-rose-200",
    hoverShadow: "hover:shadow-rose-100/60",
    chip: { bg: "bg-rose-100", text: "text-rose-700", label: "Rapide" },
  },
];

export default function WhyNovaSection() {
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
            La plateforme qui vous{" "}
            <span className="gradient-text-nova">fait confiance</span>
          </motion.h2>
          <motion.p
            className="text-gray-500 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Des milliers de clients font confiance à NOVA chaque mois pour leurs projets automobile et immobilier en Côte d'Ivoire.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
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
                  <Icon className="h-7 w-7 text-white" />
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
