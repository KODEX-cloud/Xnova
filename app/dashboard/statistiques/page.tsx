"use client";

import { useEffect, useState } from "react";
import { BarChart3, Eye, Heart, MessageSquare, TrendingUp, Car, Home } from "lucide-react";

interface Stats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalFavorites: number;
  totalMessages: number;
  listingsByType: { cars: number; properties: number };
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats").then(r => r.json()).then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Annonces actives", value: stats.activeListings, total: stats.totalListings, icon: BarChart3, color: "text-nova-red bg-nova-red/10" },
    { label: "Vues totales", value: stats.totalViews, icon: Eye, color: "text-blue-600 bg-blue-50" },
    { label: "Favoris reçus", value: stats.totalFavorites, icon: Heart, color: "text-pink-600 bg-pink-50" },
    { label: "Messages reçus", value: stats.totalMessages, icon: MessageSquare, color: "text-violet-600 bg-violet-50" },
  ] : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Statistiques</h1>
        <p className="text-gray-500 text-sm mt-0.5">Performance de vos annonces</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>
      ) : !stats ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
          <BarChart3 size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Impossible de charger les statistiques.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="bg-white rounded-2xl border-2 border-gray-100 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{c.value.toLocaleString("fr-FR")}</p>
                  {c.total !== undefined && <p className="text-gray-400 text-xs mt-0.5">sur {c.total} total</p>}
                  <p className="text-gray-600 text-sm font-medium mt-1">{c.label}</p>
                </div>
              );
            })}
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Répartition par type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="w-10 h-10 rounded-xl bg-nova-red/10 flex items-center justify-center">
                  <Car size={18} className="text-nova-red" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{stats.listingsByType.cars}</p>
                  <p className="text-gray-500 text-sm">Automobiles</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Home size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{stats.listingsByType.properties}</p>
                  <p className="text-gray-500 text-sm">Immobilier</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade CTA if no stats module */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex items-center gap-4">
            <TrendingUp size={32} className="text-nova-red flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold">Statistiques avancées</p>
              <p className="text-white/50 text-sm">Vues par jour, taux de contact, comparaison marché — disponibles avec un plan Pro ou supérieur.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
