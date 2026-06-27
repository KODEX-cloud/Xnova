"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Crown, Zap, Star, AlertTriangle, RefreshCw } from "lucide-react";
import { getPlan, SUBSCRIPTION_PLANS, formatPrice, planColor } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";

interface SubData {
  plan: PlanId;
  expiresAt: string | null;
  usage: { listings: number };
}

export default function AbonnementPage() {
  const [sub,     setSub]     = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((r) => r.json())
      .then((data) => { setSub(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const plan = getPlan(sub?.plan ?? "FREE");
  const usedListings = sub?.usage.listings ?? 0;
  const maxListings  = plan.limits.maxListings;
  const pct = maxListings === -1 ? 0 : Math.min(100, Math.round((usedListings / maxListings) * 100));

  const daysLeft = sub?.expiresAt
    ? Math.max(0, Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / (1000 * 86400)))
    : null;

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Mon abonnement</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gérez votre plan et vos limites d'utilisation.</p>
      </div>

      {/* Current plan card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-7 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className={`h-5 w-5 ${plan.id === "PREMIUM" ? "text-purple-500" : plan.id === "PRO" ? "text-nova-red" : "text-gray-400"}`} />
              <h2 className="text-xl font-black text-gray-900">Plan {plan.name}</h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${planColor(plan.id)}`}>Actif</span>
            </div>
            <p className="text-gray-500 text-sm">{plan.description}</p>
          </div>
          {daysLeft !== null && (
            <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${daysLeft < 7 ? "text-red-600 bg-red-50 border border-red-200" : "text-gray-500 bg-gray-50 border border-gray-200"}`}>
              {daysLeft < 7 && <AlertTriangle className="h-3.5 w-3.5" />}
              {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Usage bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Annonces utilisées</span>
            <span className="text-gray-800 text-sm font-bold">
              {usedListings} / {maxListings === -1 ? "∞" : maxListings}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: maxListings === -1 ? "15%" : `${pct}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-gradient-to-r from-nova-red to-nova-orange"}`}
            />
          </div>
          {maxListings !== -1 && pct >= 100 && (
            <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Limite atteinte — passez au plan Pro pour continuer
            </p>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-gray-600 text-sm">
              <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade plans */}
      {plan.id !== "PREMIUM" && (
        <div>
          <h2 className="text-gray-900 font-bold text-lg mb-4">Passer à un plan supérieur</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SUBSCRIPTION_PLANS.filter((p) => p.id !== plan.id && p.id !== "FREE").map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border-2 p-6 ${p.popular ? "border-nova-red shadow-lg shadow-orange-100/60" : "border-gray-100 hover:border-gray-200"} transition-all`}>
                {p.badge && (
                  <span className="absolute -top-3 left-4 px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ background: p.popular ? "linear-gradient(135deg, #F97316, #FB923C)" : "#7C3AED" }}>
                    {p.badge}
                  </span>
                )}
                <h3 className="text-lg font-black text-gray-900 mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{p.description}</p>
                <p className="text-2xl font-black text-gray-900 mb-4">{formatPrice(p.price)}<span className="text-sm text-gray-400 font-normal">/mois</span></p>
                <ul className="space-y-2 mb-5">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/paiement?plan=${p.id}`}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all group ${p.popular ? "bg-gradient-to-r from-nova-red to-nova-orange text-white hover:shadow-lg hover:scale-[1.02]" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                  Passer à {p.name} <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {plan.id === "PREMIUM" && (
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-2 border-purple-200 rounded-3xl p-6 text-center">
          <Crown className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <h3 className="text-gray-900 font-black text-lg mb-1">Vous êtes sur le meilleur plan !</h3>
          <p className="text-gray-500 text-sm">Annonces illimitées, boost automatique, support prioritaire.</p>
        </div>
      )}
    </div>
  );
}
