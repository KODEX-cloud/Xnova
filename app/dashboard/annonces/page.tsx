"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Plus, Car, Home, Trash2, ArrowRight, Search,
  CheckCircle2, Clock, XCircle, AlertTriangle, Eye, Zap, RefreshCw,
} from "lucide-react";

interface Listing {
  id: string;
  type: "AUTOMOBILE" | "IMMOBILIER";
  title: string;
  price: number;
  priceType: string;
  status: string;
  planType: string;
  isBoosted: boolean;
  city?: string;
  images: string;
  createdAt: string;
  views: number;
}

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  ACTIVE:   { label: "Actif",      cls: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  PENDING:  { label: "En attente", cls: "text-amber-600 bg-amber-50 border-amber-200",       icon: Clock },
  EXPIRED:  { label: "Expiré",     cls: "text-gray-400 bg-gray-50 border-gray-200",          icon: AlertTriangle },
  REJECTED: { label: "Refusé",     cls: "text-red-600 bg-red-50 border-red-200",             icon: XCircle },
};

const PLAN_STYLE: Record<string, string> = {
  PREMIUM:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  EN_AVANT: "bg-purple-100 text-purple-700 border-purple-200",
  GRATUIT:  "bg-gray-100 text-gray-500 border-gray-200",
};

export default function DashboardAnnoncesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<"ALL" | "AUTOMOBILE" | "IMMOBILIER">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/listings");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setListings(data.listings ?? []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = listings
    .filter((l) => filter === "ALL" || l.type === filter)
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  async function remove(id: string, type: string) {
    if (!confirm("Supprimer definitvement cette annonce ?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/annonces/${id}?type=${type}`, { method: "DELETE" });
      if (res.ok) setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Mes annonces</h1>
          <p className="text-gray-500 text-sm">{listings.length} annonce{listings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={load}
            disabled={loading}
            className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/publier"
            className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold text-sm rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/25"
          >
            <Plus className="h-4 w-4" /> Nouvelle
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/40"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "AUTOMOBILE", "IMMOBILIER"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                filter === f
                  ? "bg-nova-red text-white border-nova-red"
                  : "bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {f === "ALL" ? "Tous" : f === "AUTOMOBILE" ? "Auto" : "Immo"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border-2 border-gray-100 p-12 text-center shadow-sm">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Aucune annonce trouvee</p>
          <p className="text-gray-400 text-sm mb-6">Publiez votre premiere annonce des maintenant.</p>
          <Link href="/publier" className="inline-flex items-center gap-2 px-6 py-3 bg-nova-red text-white font-bold text-sm rounded-2xl hover:bg-nova-red/90 transition-all">
            <Plus className="h-4 w-4" /> Publier une annonce
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l, i) => {
            const planKey = l.planType || "GRATUIT";
            const st = STATUS_MAP[l.status] ?? STATUS_MAP.PENDING;
            const StatusIcon = st.icon;
            const imgs = (() => { try { return JSON.parse(l.images); } catch { return []; } })();
            const thumb = imgs[0];

            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${l.type === "AUTOMOBILE" ? "bg-orange-50" : "bg-blue-50"}`}>
                      {l.type === "AUTOMOBILE"
                        ? <Car className="h-5 w-5 text-nova-red" />
                        : <Home className="h-5 w-5 text-blue-500" />
                      }
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-800 font-semibold text-sm truncate">{l.title}</p>
                    {l.isBoosted && <Zap className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                      <StatusIcon className="h-2.5 w-2.5" /> {st.label}
                    </span>
                    <span className="text-gray-400 text-xs">{l.type === "AUTOMOBILE" ? "Auto" : "Immo"}</span>
                    {l.city && <><span className="text-gray-300 text-xs">.</span><span className="text-gray-400 text-xs">{l.city}</span></>}
                    <span className="text-gray-300 text-xs">.</span>
                    <span className="text-gray-400 text-xs flex items-center gap-0.5"><Eye className="h-3 w-3" />{l.views}</span>
                  </div>
                </div>

                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-gray-800 font-bold text-sm">{Number(l.price).toLocaleString("fr-FR")} FCFA</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mt-0.5 ${PLAN_STYLE[planKey] || PLAN_STYLE.GRATUIT}`}>
                    {planKey === "EN_AVANT" ? "En avant" : planKey === "PREMIUM" ? "Premium" : "Gratuit"}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/${l.type === "AUTOMOBILE" ? "automobile" : "immobilier"}/${l.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-nova-red text-xs font-medium transition-all border border-gray-200 hover:border-orange-200"
                  >
                    Voir <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => remove(l.id, l.type)}
                    disabled={deleting === l.id}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all border border-gray-200 hover:border-red-200 disabled:opacity-50"
                  >
                    {deleting === l.id
                      ? <div className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />
                    }
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
