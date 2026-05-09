"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, Car } from "lucide-react";
import CarCard, { CarItem, SkeletonCarCard } from "./CarCard";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const NAV_TABS = [
  { label: "Tous",       href: "/automobile" },
  { label: "Vente",      href: "/automobile/vente" },
  { label: "Location",   href: "/automobile/location" },
  { label: "Pièces auto", href: "/automobile/pieces" },
];

interface CarListingShellProps {
  title: string;
  subtitle: string;
  apiQuery: string;
  activeTab: string;
  emptyMessage?: string;
  badge?: string;
}

const LIMIT = 9;

export default function CarListingShell({
  title, subtitle, apiQuery, activeTab,
  emptyMessage = "Aucun véhicule trouvé.", badge = "Automobile",
}: CarListingShellProps) {
  const [cars,     setCars]     = useState<CarItem[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.whatsapp) setWhatsapp(d.whatsapp); })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(apiQuery || "");
    params.set("limit", String(LIMIT));
    params.set("page", String(page));
    const res = await fetch(`/api/cars?${params.toString()}`);
    const data = await res.json();
    let arr: CarItem[] = data.cars || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) => c.title.toLowerCase().includes(q) ||
               (c.brand || "").toLowerCase().includes(q) ||
               (c.city || "").toLowerCase().includes(q)
      );
    }
    setCars(arr);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [apiQuery, page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Premium Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nova-red/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-nova-orange/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nova-red via-nova-orange to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-nova-red/20 text-nova-red border border-nova-red/30 mb-5 backdrop-blur-sm">
                <Car className="h-3.5 w-3.5" /> {badge}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">{title}</h1>
              <p className="text-white/60 text-base max-w-xl">{subtitle}</p>
              {!loading && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-nova-red animate-pulse" />
                  <span className="text-nova-red font-bold text-sm">{total} véhicule{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            {/* Search in hero */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Marque, modèle, ville…"
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-10 py-3.5 text-white text-sm placeholder-white/35 focus:outline-none focus:border-nova-red/60 focus:bg-white/15 transition-all backdrop-blur-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Nav Tabs ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {NAV_TABS.map((tab) => (
              <Link key={tab.href} href={tab.href}
                className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === tab.href
                    ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-md shadow-orange-300/30"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>{tab.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCarCard key={i} />)}
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
              <Car className="h-8 w-8 text-nova-red/40" />
            </div>
            <p className="text-gray-700 font-bold text-lg mb-2">{emptyMessage}</p>
            <p className="text-gray-400 text-sm mb-6">Essayez de modifier votre recherche</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="px-6 py-2.5 bg-gradient-to-r from-nova-red to-nova-orange text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-orange-300/40 transition-all">
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${search}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {cars.map((car, i) => <CarCard key={car.id} car={car} index={i} whatsapp={whatsapp} />)}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 hover:border-nova-red/40 text-gray-500 hover:text-nova-red disabled:opacity-30 transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.min(7, pages) }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  n === page
                    ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-md shadow-orange-300/40"
                    : "bg-white border border-gray-200 hover:border-nova-red/40 text-gray-500 hover:text-nova-red"
                }`}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 hover:border-nova-red/40 text-gray-500 hover:text-nova-red disabled:opacity-30 transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
