"use client";

import { useEffect, useState } from "react";
import { Receipt, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

interface Invoice {
  id: string; number: string; amount: number; tax: number; total: number;
  currency: string; status: string; description: string | null;
  pdfUrl: string | null; issuedAt: string;
}

const STATUS = {
  PAID:      { label: "Payé",     cls: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  PENDING:   { label: "En attente", cls: "text-amber-600 bg-amber-50 border-amber-200",     icon: Clock },
  CANCELLED: { label: "Annulé",   cls: "text-red-500 bg-red-50 border-red-200",            icon: XCircle },
};

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices").then(r => r.json()).then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Mes factures</h1>
        <p className="text-gray-500 text-sm mt-0.5">{invoices.length} facture{invoices.length > 1 ? "s" : ""} au total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
          <Receipt size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 font-bold text-lg mb-2">Aucune facture</h2>
          <p className="text-gray-500 text-sm">Vos factures apparaîtront ici après chaque paiement.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Numéro", "Description", "Montant HT", "TVA", "Total TTC", "Statut", "Date", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map(inv => {
                const st = STATUS[inv.status as keyof typeof STATUS] ?? STATUS.PENDING;
                const Icon = st.icon;
                return (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-700 font-medium">{inv.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{inv.description || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(inv.amount)} {inv.currency}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatPrice(inv.tax)} {inv.currency}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatPrice(inv.total)} {inv.currency}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${st.cls}`}>
                        <Icon size={11} /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(inv.issuedAt)}</td>
                    <td className="px-4 py-3">
                      {inv.pdfUrl && (
                        <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Download size={14} className="text-gray-600" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
