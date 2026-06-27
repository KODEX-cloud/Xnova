"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, CreditCard, Crown, Eye, Inbox, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  users:         { total: number; newThisMonth: number; trend: number };
  revenue:       { total: number; thisMonth: number; trend: number };
  cars:          { total: number; active: number };
  properties:    { total: number; active: number };
  leads:         { total: number; unread: number };
  subscriptions: { active: number; byPlan: { plan: string; _count: { id: number } }[] };
  pending:       number;
}

function KPI({ label, value, sub, trend, icon: Icon, color }: {
  label: string; value: string | number; sub?: string; trend?: number;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-white text-2xl font-black">{value}</p>
      <p className="text-white/50 text-sm mt-0.5">{label}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

const PLAN_COLORS: Record<string, string> = {
  FREE:       "bg-gray-500",
  STARTER:    "bg-blue-500",
  BUSINESS:   "bg-nova-red",
  PREMIUM:    "bg-violet-500",
  ENTERPRISE: "bg-amber-500",
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/stats").then(r => r.json()).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const totalListings = (stats?.cars.total ?? 0) + (stats?.properties.total ?? 0);
  const activeListings = (stats?.cars.active ?? 0) + (stats?.properties.active ?? 0);
  const totalSubs = stats?.subscriptions.byPlan.reduce((a, b) => a + b._count.id, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <BarChart3 size={20} className="text-nova-red" /> Analytics
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Performance globale de la plateforme</p>
        </div>
        <button onClick={load} disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-50">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Utilisateurs" value={stats?.users.total ?? "—"} sub={`+${stats?.users.newThisMonth ?? 0} ce mois`} trend={stats?.users.trend} icon={Users} color="bg-blue-500/15 text-blue-400" />
        <KPI label="Revenu ce mois" value={stats ? formatPrice(stats.revenue.thisMonth) : "—"} sub={`Total: ${stats ? formatPrice(stats.revenue.total) : "—"}`} trend={stats?.revenue.trend} icon={CreditCard} color="bg-emerald-500/15 text-emerald-400" />
        <KPI label="Annonces actives" value={`${activeListings} / ${totalListings}`} sub={`${stats?.pending ?? 0} en attente`} icon={Eye} color="bg-nova-red/15 text-nova-red" />
        <KPI label="Abonnés actifs" value={stats?.subscriptions.active ?? "—"} sub={`${totalSubs} total toutes périodes`} icon={Crown} color="bg-violet-500/15 text-violet-400" />
      </div>

      {/* Subscriptions breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Crown size={15} className="text-violet-400" /> Abonnements par plan</h2>
          {!stats ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>
          ) : stats.subscriptions.byPlan.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">Aucun abonnement actif</p>
          ) : (
            <div className="space-y-3">
              {stats.subscriptions.byPlan.sort((a, b) => b._count.id - a._count.id).map(({ plan, _count }) => {
                const pct = totalSubs > 0 ? Math.round((_count.id / totalSubs) * 100) : 0;
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/70 text-sm">{plan}</span>
                      <span className="text-white font-bold text-sm">{_count.id} <span className="text-white/30 font-normal text-xs">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${PLAN_COLORS[plan] || "bg-gray-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leads pipeline */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Inbox size={15} className="text-orange-400" /> Leads & Messages</h2>
          {!stats ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                  <p className="text-white text-2xl font-black">{stats.leads.total}</p>
                  <p className="text-white/40 text-xs mt-0.5">Total leads</p>
                </div>
                <div className="bg-nova-red/5 border border-nova-red/20 rounded-xl p-4 text-center">
                  <p className="text-nova-red text-2xl font-black">{stats.leads.unread}</p>
                  <p className="text-white/40 text-xs mt-0.5">Non traités</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Taux de traitement</span>
                  <span className="text-white font-bold">
                    {stats.leads.total > 0 ? Math.round(((stats.leads.total - stats.leads.unread) / stats.leads.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stats.leads.total > 0 ? Math.round(((stats.leads.total - stats.leads.unread) / stats.leads.total) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Listings breakdown */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Eye size={15} className="text-nova-red" /> Annonces</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Voitures actives", val: stats?.cars.active ?? "—", sub: `/ ${stats?.cars.total ?? "—"} total`, color: "text-nova-red" },
            { label: "Immo actifs", val: stats?.properties.active ?? "—", sub: `/ ${stats?.properties.total ?? "—"} total`, color: "text-blue-400" },
            { label: "En attente", val: stats?.pending ?? "—", sub: "à valider", color: "text-amber-400" },
            { label: "Taux activation", val: totalListings > 0 ? Math.round((activeListings / totalListings) * 100) + "%" : "—", sub: "annonces actives", color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] rounded-xl p-4">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-white/70 text-sm font-medium mt-0.5">{s.label}</p>
              <p className="text-white/30 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note about GA */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
        <TrendingUp size={20} className="text-nova-red flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-medium">Connectez Google Analytics pour des analytics avancés</p>
          <p className="text-white/40 text-sm mt-1">Configurez votre ID Google Analytics dans <strong className="text-white/60">Admin → Paramètres → SEO</strong> pour activer les données de visites, pages vues, et conversions en temps réel.</p>
        </div>
      </div>
    </div>
  );
}
