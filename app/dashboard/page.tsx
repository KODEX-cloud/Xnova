"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, CreditCard, CheckCircle2, Plus, ArrowRight,
  TrendingUp, Eye, Clock, Star, Zap, Crown, AlertTriangle,
} from "lucide-react";
import { getPlan, planColor, boostColor, formatPrice } from "@/lib/plans";
import type { PlanId, BoostType } from "@/lib/plans";

interface Listing {
  id: string; title: string; price: number; priceType: string;
  status: string; planType: string; isBoosted: boolean;
  city?: string; images: string; createdAt: string; views: number;
  type: "AUTOMOBILE" | "IMMOBILIER";
}

interface DashData {
  listings: Listing[];
  stats: { total: number; active: number; pending: number; expired: number };
  plan: PlanId;
  canPublishMore: boolean;
  maxListings: number;
}

interface SubData {
  plan: PlanId;
  expiresAt: string | null;
  usage: { listings: number };
}

export default function DashboardPage() {
  const [dash, setDash] = useState<DashData | null>(null);
  const [sub,  setSub]  = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/listings").then((r) => r.json()),
      fetch("/api/subscriptions").then((r) => r.json()),
    ]).then(([d, s]) => {
      setDash(d);
      setSub(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const plan = getPlan(dash?.plan ?? "FREE");
  const pct  = plan.limits.maxListings === -1
    ? 0
    : Math.min(100, Math.round(((dash?.stats.total ?? 0) / plan.limits.maxListings) * 100));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez vos annonces et suivez vos performances.</p>
        </div>
        {dash?.canPublishMore ? (
          <Link href="/publier"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-full text-sm hover:shadow-lg hover:scale-[1.02] transition-all group">
            <Plus className="h-4 w-4" /> Publier une annonce
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link href="/pricing"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-full text-sm hover:shadow-lg hover:scale-[1.02] transition-all">
            <Crown className="h-4 w-4" /> Passer à Pro
          </Link>
        )}
      </div>

      {/* Subscription banner */}
      {plan.id === "FREE" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-nova-red" />
            </div>
            <div>
              <p className="text-gray-800 font-bold text-sm">Plan Gratuit — {pct}% utilisé</p>
              <p className="text-gray-500 text-xs">
                {dash?.stats.total ?? 0}/{plan.limits.maxListings} annonce{plan.limits.maxListings > 1 ? "s" : ""} utilisée{plan.limits.maxListings > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Link href="/pricing"
            className="flex items-center gap-1.5 px-4 py-2 bg-nova-red text-white text-xs font-bold rounded-full hover:bg-nova-orange transition-colors whitespace-nowrap">
            Passer Pro <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText,     label: "Total annonces",  value: dash?.stats.total   ?? 0, color: "text-blue-600",  bg: "bg-blue-50 border-blue-100" },
          { icon: CheckCircle2, label: "Annonces actives", value: dash?.stats.active  ?? 0, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { icon: Clock,        label: "En attente",       value: dash?.stats.pending ?? 0, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          { icon: Eye,          label: "Vues totales",     value: (dash?.listings ?? []).reduce((s, l) => s + l.views, 0), color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`p-5 rounded-2xl bg-white border-2 ${s.bg} shadow-sm`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Listings */}
      {!dash?.listings.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-3xl bg-white border-2 border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-nova-red/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-nova-red" />
          </div>
          <h2 className="text-gray-900 font-black text-xl mb-3">Aucune annonce publiée</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
            Publiez votre première annonce et atteignez des milliers d'acheteurs qualifiés.
          </p>
          <Link href="/publier"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-2xl hover:shadow-lg transition-all">
            <Plus className="h-4 w-4" /> Publier une annonce
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 font-bold text-lg">Dernières annonces</h2>
            <Link href="/dashboard/annonces" className="flex items-center gap-1 text-nova-red text-sm font-medium hover:underline">
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {(dash?.listings ?? []).slice(0, 5).map((l, i) => {
              const imgs = (() => { try { return JSON.parse(l.images); } catch { return []; } })();
              const thumb = imgs[0];
              const statusMap: Record<string, { label: string; cls: string }> = {
                ACTIVE:   { label: "Actif",       cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                PENDING:  { label: "En attente",  cls: "text-amber-600 bg-amber-50 border-amber-200" },
                EXPIRED:  { label: "Expiré",      cls: "text-gray-400 bg-gray-50 border-gray-200" },
                REJECTED: { label: "Refusé",      cls: "text-red-600 bg-red-50 border-red-200" },
              };
              const st = statusMap[l.status] ?? statusMap.PENDING;

              return (
                <motion.div key={l.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/dashboard/annonces/${l.id}?type=${l.type}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${l.type === "AUTOMOBILE" ? "bg-orange-50" : "bg-blue-50"}`}>
                          <FileText className={`h-5 w-5 ${l.type === "AUTOMOBILE" ? "text-nova-red" : "text-blue-500"}`} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 font-semibold text-sm truncate">{l.title}</p>
                        {l.isBoosted && <Zap className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span>
                        <span className="text-gray-400 text-xs">{l.type === "AUTOMOBILE" ? "Auto" : "Immo"}</span>
                        <span className="text-gray-300 text-xs">·</span>
                        <span className="text-gray-400 text-xs flex items-center gap-0.5"><Eye className="h-3 w-3" />{l.views}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-gray-800 font-bold text-sm">{Number(l.price).toLocaleString("fr-FR")} FCFA</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${boostColor(l.planType as BoostType)}`}>
                        {l.planType === "GRATUIT" ? "Gratuit" : l.planType}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <Link href="/publier"
            className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-nova-red/50 text-gray-400 hover:text-nova-red rounded-2xl transition-all text-sm font-medium">
            <Plus className="h-4 w-4" /> Publier une nouvelle annonce
          </Link>
        </div>
      )}
    </div>
  );
}
