"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, XCircle, AlertCircle, Search, Filter, TrendingUp, Users, DollarSign } from "lucide-react";

interface Payment {
  id: string; amount: number; currency: string; method: string;
  status: string; reference: string; type: string; planType: string | null;
  notes: string | null; phone: string | null; createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

interface PayData { payments: Payment[]; total: number; totalAmount: number; page: number; pages: number }

const STATUS = {
  COMPLETED: { label: "Payé",       cls: "text-emerald-600 bg-emerald-50 border-emerald-200", Icon: CheckCircle2 },
  PENDING:   { label: "En attente", cls: "text-amber-600 bg-amber-50 border-amber-200",       Icon: Clock },
  FAILED:    { label: "Échoué",     cls: "text-red-600 bg-red-50 border-red-200",             Icon: XCircle },
  REFUNDED:  { label: "Remboursé",  cls: "text-gray-500 bg-gray-50 border-gray-200",          Icon: AlertCircle },
} as const;

const METHOD_LABEL: Record<string, string> = {
  MTN_MOMO: "MTN MoMo", ORANGE_MONEY: "Orange Money",
  MOOV_MONEY: "Moov Money", CARD: "Carte bancaire", MANUAL: "Manuel",
};

const TYPE_LABEL: Record<string, string> = {
  SUBSCRIPTION: "Abonnement", BOOST: "Boost", ANNONCE: "Annonce",
};

export default function AdminPaiementsPage() {
  const [data,    setData]    = useState<PayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("ALL");
  const [page,    setPage]    = useState(1);

  const load = (p = 1) => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(p), limit: "20", ...(status !== "ALL" ? { status } : {}) });
    fetch(`/api/payments?${q}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page, status]);

  const payments = data?.payments ?? [];
  const completed = payments.filter((p) => p.status === "COMPLETED");
  const totalRevenue = data?.totalAmount ?? 0;

  const filtered = search
    ? payments.filter((p) =>
        p.reference.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(search.toLowerCase())
      )
    : payments;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Paiements</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gérez toutes les transactions de la plateforme.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: CreditCard,   label: "Total transactions", value: data?.total ?? 0,       color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
          { Icon: CheckCircle2, label: "Complétés",          value: completed.length,        color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { Icon: DollarSign,   label: "Revenus totaux",     value: `${totalRevenue.toLocaleString("fr-FR")} FCFA`, color: "text-nova-red", bg: "bg-orange-50 border-orange-100" },
          { Icon: Users,        label: "Clients actifs",     value: new Set(payments.map((p) => p.user?.id).filter(Boolean)).size, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`p-5 rounded-2xl bg-white border-2 ${s.bg} shadow-sm`}>
            <s.Icon className={`h-5 w-5 ${s.color} mb-3`} />
            <p className={`text-xl font-black ${s.color} mb-1`}>{s.value}</p>
            <p className="text-gray-400 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par réf, nom, email…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-nova-red/50 transition-all" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-nova-red/50">
          <option value="ALL">Tous les statuts</option>
          <option value="COMPLETED">Payé</option>
          <option value="PENDING">En attente</option>
          <option value="FAILED">Échoué</option>
          <option value="REFUNDED">Remboursé</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">Aucun paiement trouvé.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                {["Référence", "Client", "Type", "Méthode", "Montant", "Statut", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const st = STATUS[p.status as keyof typeof STATUS] ?? STATUS.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{p.reference}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{p.user?.name ?? "—"}</p>
                      <p className="text-gray-400 text-[10px]">{p.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{TYPE_LABEL[p.type] ?? p.type}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{METHOD_LABEL[p.method] ?? p.method}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 text-xs">{p.amount.toLocaleString("fr-FR")} {p.currency}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                        <st.Icon className="h-3 w-3" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all">
            Précédent
          </button>
          <span className="text-sm text-gray-500">Page {page} / {data.pages}</span>
          <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 disabled:opacity-40 transition-all">
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
