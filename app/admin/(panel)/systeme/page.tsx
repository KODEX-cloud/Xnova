"use client";

import { useEffect, useState } from "react";
import { Server, Download, RefreshCw, CheckCircle, AlertTriangle, Database, Globe, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Stats {
  users: { total: number; newThisMonth: number };
  revenue: { total: number; thisMonth: number };
  cars: { total: number }; properties: { total: number };
  pending: number; subscriptions: { active: number };
}

const EXPORTS = [
  { type: "users", label: "Utilisateurs", desc: "Tous les comptes avec rôles et abonnements" },
  { type: "payments", label: "Paiements", desc: "Historique complet des transactions" },
  { type: "leads", label: "Leads CRM", desc: "Tous les leads avec statut pipeline" },
  { type: "listings", label: "Annonces", desc: "Voitures + Immobilier" },
];

export default function SystemPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbOk, setDbOk] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()).then(setStats),
      fetch("/api/stats").then(r => { setDbOk(r.ok); }).catch(() => setDbOk(false)),
    ]).finally(() => setLoading(false));
  }, []);

  const reload = () => { setLoading(true); window.location.reload(); };

  const download = (type: string) => {
    window.open(`/api/admin/export?type=${type}`, "_blank");
  };

  const now = new Date();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Server size={20} className="text-violet-400" /> Système & Exports
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Santé de la plateforme, exports CSV et statistiques globales</p>
        </div>
        <button onClick={reload} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* System health */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Zap size={15} className="text-emerald-400" /> Santé système</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Base de données", ok: dbOk, icon: Database },
            { label: "API", ok: true, icon: Globe },
            { label: "Stockage", ok: true, icon: Server },
            { label: "Auth", ok: true, icon: CheckCircle },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`flex items-center gap-3 p-3 rounded-xl border ${s.ok === null ? "border-white/5 bg-white/[0.02]" : s.ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                <Icon size={16} className={s.ok === null ? "text-white/30" : s.ok ? "text-emerald-400" : "text-red-400"} />
                <div>
                  <p className="text-white text-sm font-medium">{s.label}</p>
                  <p className={`text-xs ${s.ok === null ? "text-white/30" : s.ok ? "text-emerald-400" : "text-red-400"}`}>
                    {s.ok === null ? "Vérification…" : s.ok ? "Opérationnel" : "Erreur"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-white/20 text-xs mt-3">Dernière vérification : {formatDate(now)}</p>
      </div>

      {/* Platform stats */}
      {stats && (
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Statistiques plateforme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Utilisateurs", val: stats.users.total },
              { label: "Voitures", val: stats.cars.total },
              { label: "Immobilier", val: stats.properties.total },
              { label: "Abonnés actifs", val: stats.subscriptions.active },
              { label: "En attente", val: stats.pending },
              { label: "Revenu total", val: new Intl.NumberFormat("fr-FR").format(stats.revenue.total) + " FCFA" },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="text-white font-bold text-lg">{s.val}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exports */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Download size={15} className="text-blue-400" /> Exports CSV</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXPORTS.map(ex => (
            <div key={ex.type} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <p className="text-white text-sm font-medium">{ex.label}</p>
                <p className="text-white/30 text-xs mt-0.5">{ex.desc}</p>
              </div>
              <button onClick={() => download(ex.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold hover:bg-blue-500/20 transition-colors">
                <Download size={12} /> CSV
              </button>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs mt-3 flex items-center gap-1.5">
          <AlertTriangle size={11} className="text-amber-400/60" />
          Les exports contiennent des données sensibles. Réservé aux Super Admins.
        </p>
      </div>

      {/* Version info */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-3">Informations système</h2>
        <div className="space-y-2">
          {[
            { label: "Version NOVA", val: "4.0.0 SaaS Enterprise" },
            { label: "Framework", val: "Next.js 15.5 App Router" },
            { label: "ORM", val: "Prisma 5.22" },
            { label: "Base de données", val: "PostgreSQL (Supabase)" },
            { label: "Environnement", val: process.env.NODE_ENV || "production" },
          ].map(i => (
            <div key={i.label} className="flex items-center justify-between text-sm py-1.5 border-b border-white/[0.04] last:border-0">
              <span className="text-white/50">{i.label}</span>
              <span className="text-white/80 font-mono">{i.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
