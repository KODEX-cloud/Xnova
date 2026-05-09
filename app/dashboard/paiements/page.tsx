"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, Clock, XCircle, AlertCircle, Zap, Star, ArrowRight, Crown } from "lucide-react";

interface Payment {
  id: string; amount: number; currency: string; method: string;
  status: string; reference: string; type: string; planType: string | null;
  notes: string | null; createdAt: string;
}

interface PayData { payments: Payment[]; total: number; totalAmount: number }

const STATUS_MAP: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  COMPLETED: { label: "Payé",       cls: "text-emerald-600 bg-emerald-50 border-emerald-200", Icon: CheckCircle2 },
  PENDING:   { label: "En attente", cls: "text-amber-600 bg-amber-50 border-amber-200",       Icon: Clock },
  FAILED:    { label: "Échoué",     cls: "text-red-600 bg-red-50 border-red-200",             Icon: XCircle },
  REFUNDED:  { label: "Remboursé",  cls: "text-gray-500 bg-gray-50 border-gray-200",          Icon: AlertCircle },
};

const TYPE_LABEL: Record<string, string> = {
  SUBSCRIPTION: "Abonnement", BOOST: "Boost annonce", ANNONCE: "Publication annonce",
};

const METHOD_LABEL: Record<string, string> = {
  MTN_MOMO: "MTN Mobile Money", ORANGE_MONEY: "Orange Money",
  MOOV_MONEY: "Moov Money", CARD: "Carte bancaire", MANUAL: "Manuel",
};

export default function DashboardPaiementsPage() {
  const [data,    setData]    = useState<PayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
    </div>
  );

  const payments = data?.payments ?? [];
  const completed = payments.filter((p) => p.status === "COMPLETED");
  const totalPaid = completed.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Mes paiements</h1>
        <p className="text-gray-500 text-sm mt-0.5">Historique de vos transactions et plans souscrits.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { Icon: CreditCard,   value: payments.length,                label: "Transactions totales",   color: "text-nova-red",    bg: "bg-orange-50 border-orange-100" },
          { Icon: CheckCircle2, value: completed.length,               label: "Paiements confirmés",    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { Icon: Star,         value: `${totalPaid.toLocaleString("fr-FR")} FCFA`, label: "Total dépensé", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl bg-white border-2 ${s.bg} shadow-sm`}>
            <s.Icon className={`h-5 w-5 ${s.color} mb-3`} />
            <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
            <p className="text-gray-400 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {payments.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-3xl bg-white border-2 border-gray-100 p-12 text-center shadow-sm">
          <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-bold mb-2">Aucun paiement effectué</p>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Boostez vos annonces ou souscrivez à un plan pour apparaître ici.
          </p>
          <Link href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold text-sm rounded-2xl hover:shadow-lg transition-all">
            <Crown className="h-4 w-4" /> Voir les plans
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Transactions</h2>
          {payments.map((p, i) => {
            const st = STATUS_MAP[p.status] ?? STATUS_MAP.PENDING;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all shadow-sm">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${st.cls}`}>
                  <st.Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-sm">{TYPE_LABEL[p.type] ?? p.type}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {METHOD_LABEL[p.method] ?? p.method}
                    {" · "}
                    {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-gray-300 text-[10px] mt-0.5 font-mono">{p.reference}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gray-800 font-black text-sm">{p.amount.toLocaleString("fr-FR")} {p.currency}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upgrade CTA */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-gray-800 font-bold">Besoin de plus de visibilité ?</p>
          <p className="text-gray-500 text-sm">Passez au plan Pro ou Premium pour des annonces illimitées.</p>
        </div>
        <Link href="/pricing"
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red text-white font-bold rounded-full text-sm hover:bg-nova-orange transition-colors whitespace-nowrap">
          Voir les plans <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
