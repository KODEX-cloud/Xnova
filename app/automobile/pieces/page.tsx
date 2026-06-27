"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wrench, CheckCircle2, MessageCircle, Phone, ArrowRight,
  ShieldCheck, Truck, Clock, Star,
} from "lucide-react";

interface Settings { whatsapp?: string; phone?: string; }

const CATEGORIES = [
  { label: "Moteur & Transmission", items: ["Filtres à huile", "Courroies", "Bougies", "Embrayage", "Boîte de vitesses"] },
  { label: "Freinage & Suspension", items: ["Plaquettes de frein", "Disques", "Amortisseurs", "Ressorts", "Rotules"] },
  { label: "Carrosserie & Extérieur", items: ["Pare-chocs", "Phares", "Rétroviseurs", "Vitres", "Portes"] },
  { label: "Électronique & Accessoires", items: ["Batteries", "Alternateurs", "Démarreurs", "Capteurs", "Autoradios"] },
];

const AVANTAGES = [
  { icon: ShieldCheck, label: "Pièces certifiées", desc: "Neuves et d'occasion garanties" },
  { icon: Truck, label: "Livraison Abidjan", desc: "Livraison rapide partout en ville" },
  { icon: Clock, label: "Stock disponible", desc: "Plus de 5 000 références en stock" },
  { icon: Star, label: "Meilleurs prix", desc: "Tarifs compétitifs garantis" },
];

export default function PiecesAutoPage() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const waUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent("Bonjour NOVA, je cherche une pièce auto. Pouvez-vous m'aider ?")}`
    : "#";

  return (
    <div className="min-h-screen bg-nova-darker">
      {/* Hero */}
      <div className="relative bg-nova-dark border-b border-white/5 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-nova-orange/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-nova-red/4 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 text-nova-orange text-xs font-bold uppercase tracking-widest mb-4">
            <Wrench className="h-3.5 w-3.5" /> Pièces Automobile
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Pièces auto <span className="text-nova-orange">certifiées</span>
          </h1>
          <p className="text-white/45 text-lg max-w-2xl mx-auto mb-8">
            Plus de 5 000 références disponibles — neuves et d'occasion certifiées pour tous types de véhicules.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {settings.whatsapp && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-all hover:shadow-lg hover:shadow-green-600/30">
                <MessageCircle className="h-4 w-4" /> Commander sur WhatsApp
              </a>
            )}
            <Link href="/services/pieces-auto"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-nova-orange hover:bg-nova-orange/90 text-white font-bold transition-all hover:shadow-lg hover:shadow-nova-orange/30">
              <Wrench className="h-4 w-4" /> Voir le service complet
            </Link>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {AVANTAGES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-nova-navy rounded-2xl border border-white/5 p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-nova-orange/15 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-nova-orange" />
                </div>
                <p className="text-white font-bold text-sm mb-1">{a.label}</p>
                <p className="text-white/40 text-xs">{a.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Catalog grid */}
        <h2 className="text-white font-black text-2xl mb-8">Catégories disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-nova-navy rounded-2xl border border-white/5 p-5 hover:border-nova-orange/20 transition-colors"
            >
              <h3 className="text-white font-bold text-sm mb-4 pb-3 border-b border-white/[0.06]">{cat.label}</h3>
              <ul className="space-y-2">
                {cat.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-white/55 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-10 md:p-14 bg-gradient-to-br from-nova-orange/10 via-nova-red/5 to-transparent border border-nova-orange/10 text-center">
          <Wrench className="h-10 w-10 text-nova-orange mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-2">Vous ne trouvez pas votre pièce ?</h3>
          <p className="text-white/45 text-sm mb-8 max-w-md mx-auto">
            Contactez-nous directement via WhatsApp ou téléphone. Nous sourçons votre pièce en 24h.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {settings.whatsapp && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone}`}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            )}
            <Link href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-nova-orange hover:bg-nova-orange/90 text-white font-bold transition-all">
              Formulaire de contact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
