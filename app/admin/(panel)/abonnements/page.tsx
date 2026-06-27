"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, CheckCircle2, Clock, XCircle, Search, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface Subscription {
  id: string; plan: string; status: string;
  startsAt: string; expiresAt: string | null; createdAt: string;
  user: { id: string; name: string; email: string; phone?: string };
  payment: { reference: string; amount: number } | null;
}

const PLAN_STYLE: Record<string, { cls: string; label: string }> = {
  FREE:    { cls: "text-gray-500 bg-gray-50 border-gray-200",     label: "Gratuit" },
  PRO:     { cls: "text-nova-red bg-orange-50 border-orange-200", label: "Pro" },
  PREMIUM: { cls: "text-purple-600 bg-purple-50 border-purple-200", label: "Premium" },
};

const STATUS_STYLE: Record<string, { cls: string; label: string; Icon: typeof CheckCircle2 }> = {
  ACTIVE:    { cls: "text-emerald-600 bg-emerald-50 border-emerald-200", label: "Actif",    Icon: CheckCircle2 },
  EXPIRED:   { cls: "text-gray-400 bg-gray-50 border-gray-200",          label: "Expiré",   Icon: XCircle },
  CANCELLED: { cls: "text-red-500 bg-red-50 border-red-200",             label: "Annulé",   Icon: XCircle },
  PENDING:   { cls: "text-amber-600 bg-amber-50 border-amber-200",       label: "En attente", Icon: Clock },
};

export default function AdminAbonnementsPage() {
  const [subs,    setSubs]    = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [planF,   setPlanF]   = useState("ALL");
  const [statusF, setStatusF] = useState("ALL");

  useEffect(() => {
    fetch("/api/subscriptions?admin=1")
      .then((r) => r.json())
      .then((d) => { setSubs(Array.isArray(d) ? d : d.subscriptions ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = subs.filter((s) => {
    if (planF !== "ALL" && s.plan !== planF) return false;
    if (statusF !== "ALL" && s.status !== statusF) return false;
    if (search && !s.user.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.user.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active  = subs.filter((s) => s.status === "ACTIVE");
  const pro     = active.filter((s) => s.plan === "PRO");
  const premium = active.filter((s) => s.plan === "PREMIUM");
  const expiring = active.filter((s) => {
    if (!s.expiresAt) return false;
    return (new Date(s.expiresAt).getTime() - Date.now()) < 7 * 86400000;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Abonnements</h1>
        <p className="text-gray-500 text-sm mt-0.5">Suivez les abonnements actifs et leur état.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: Users,         label: "Abonnés actifs",  value: active.length,   color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
          { Icon: TrendingUp,    label: "Plan Pro",        value: pro.length,      color: "text-nova-red",    bg: "bg-orange-50 border-orange-100" },
          { Icon: Crown,         label: "Plan Premium",    value: premium.length,  color: "text-purple-600",  bg: "bg-purple-50 border-purple-100" },
          { Icon: AlertTriangle, label: "Expiration <7j",  value: expiring.length, color: "text-amber-600",   bg: "bg-amber-50 border-amber-100" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`p-5 rounded-2xl bg-white border-2 ${s.bg} shadow-sm`}>
            <s.Icon className={`h-5 w-5 ${s.color} mb-3`} />
            <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
            <p className="text-gray-400 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou email…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-nova-red/50 transition-all" />
        </div>
        <select value={planF} onChange={(e) => setPlanF(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-nova-red/50">
          <option value="ALL">Tous les plans</option>
          <option value="FREE">Gratuit</option>
          <option value="PRO">Pro</option>
          <option value="PREMIUM">Premium</option>
        </select>
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-nova-red/50">
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="EXPIRED">Expiré</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Aucun abonnement trouvé.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                {["Utilisateur", "Plan", "Statut", "Débute le", "Expire le", "Paiement"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => {
                const pl = PLAN_STYLE[s.plan] ?? PLAN_STYLE.FREE;
                const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.PENDING;
                const daysLeft = s.expiresAt
                  ? Math.max(0, Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000))
                  : null;
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{s.user.name}</p>
                      <p className="text-gray-400 text-[10px]">{s.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${pl.cls}`}>
                        {pl.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                        <st.Icon className="h-3 w-3" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(s.startsAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {s.expiresAt ? (
                        <div>
                          <p className="text-gray-500 text-xs">{new Date(s.expiresAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                          {daysLeft !== null && daysLeft <= 7 && s.status === "ACTIVE" && (
                            <p className="text-amber-600 text-[10px] font-medium flex items-center gap-0.5 mt-0.5">
                              <AlertTriangle className="h-3 w-3" /> {daysLeft}j restants
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.payment ? (
                        <div>
                          <p className="font-mono text-[10px] text-gray-400">{s.payment.reference}</p>
                          <p className="text-gray-600 text-xs font-semibold">{s.payment.amount.toLocaleString("fr-FR")} FCFA</p>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
