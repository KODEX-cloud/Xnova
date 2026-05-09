"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Plus, Car, Home, Trash2, ArrowRight, Search,
} from "lucide-react";

interface StoredListing {
  id: string;
  type: string;
  title: string;
  price: number;
  createdAt: string;
  plan: string;
}

export default function DashboardAnnoncesPage() {
  const [listings, setListings] = useState<StoredListing[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "AUTOMOBILE" | "IMMOBILIER">("ALL");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova_listings");
      if (raw) setListings(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = listings
    .filter((l) => filter === "ALL" || l.type === filter)
    .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function remove(id: string) {
    if (!confirm("Supprimer cette annonce de votre liste ?")) return;
    const updated = listings.filter((l) => l.id !== id);
    localStorage.setItem("nova_listings", JSON.stringify(updated));
    setListings(updated);
  }

  const PLAN_STYLE: Record<string, string> = {
    PREMIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    EN_AVANT: "bg-purple-100 text-purple-700 border-purple-200",
    GRATUIT: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Mes annonces</h1>
          <p className="text-gray-500 text-sm">{listings.length} annonce{listings.length !== 1 ? "s" : ""} publiée{listings.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/publier"
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold text-sm rounded-2xl transition-all hover:shadow-lg hover:shadow-nova-red/25 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nouvelle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une annonce…"
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

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border-2 border-gray-100 p-12 text-center shadow-sm">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Aucune annonce trouvée</p>
          <p className="text-gray-400 text-sm mb-6">Publiez votre première annonce dès maintenant.</p>
          <Link href="/publier" className="inline-flex items-center gap-2 px-6 py-3 bg-nova-red text-white font-bold text-sm rounded-2xl hover:bg-nova-red/90 transition-all">
            <Plus className="h-4 w-4" /> Publier une annonce
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l, i) => {
            const planKey = l.plan || "GRATUIT";
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${l.type === "AUTOMOBILE" ? "bg-orange-50" : "bg-blue-50"}`}>
                  {l.type === "AUTOMOBILE"
                    ? <Car className="h-5 w-5 text-nova-red" />
                    : <Home className="h-5 w-5 text-blue-500" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-sm truncate">{l.title}</p>
                  <p className="text-gray-400 text-xs">
                    {l.type === "AUTOMOBILE" ? "Automobile" : "Immobilier"} · {new Date(l.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-gray-800 font-bold text-sm">{Number(l.price).toLocaleString("fr-FR")} FCFA</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mt-0.5 ${PLAN_STYLE[planKey] || PLAN_STYLE.GRATUIT}`}>
                    {planKey === "EN_AVANT" ? "En avant" : planKey === "PREMIUM" ? "Premium" : "Gratuit"}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/dashboard/annonces/${l.id}?type=${l.type}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-nova-red text-xs font-medium transition-all border border-gray-200 hover:border-orange-200"
                  >
                    Voir <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => remove(l.id)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all border border-gray-200 hover:border-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
