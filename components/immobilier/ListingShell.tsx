"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, Home, SlidersHorizontal, MapPin } from "lucide-react";
import PropertyCard, { SkeletonCard, Property } from "./PropertyCard";
import Navbar from "@/components/layout/Navbar";

const CITIES = [
  "Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon",
  "Treichville", "Adjamé", "Koumassi", "Port-Bouët", "San-Pédro", "Bouaké",
];

interface ListingShellProps {
  title: string;
  subtitle: string;
  badge: string;
  apiQuery: string;
  emptyMessage?: string;
  accentColor?: "red" | "emerald" | "amber";
}

export default function ListingShell({
  title, subtitle, badge, apiQuery,
  emptyMessage = "Aucun bien trouvé.", accentColor = "red",
}: ListingShellProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [city,       setCity]       = useState("");
  const [search,     setSearch]     = useState("");
  const [sort,       setSort]       = useState("newest");
  const [whatsapp,   setWhatsapp]   = useState("");
  const LIMIT = 12;

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.whatsapp) setWhatsapp(d.whatsapp); })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(apiQuery);
    params.set("limit", String(LIMIT));
    params.set("page", String(page));
    if (city) params.set("city", city);
    const res = await fetch(`/api/properties?${params.toString()}`);
    const data = await res.json();
    let props: Property[] = data.properties || [];

    if (search.trim()) {
      const q = search.toLowerCase();
      props = props.filter(
        (p) => p.title.toLowerCase().includes(q) ||
               (p.city || "").toLowerCase().includes(q) ||
               (p.district || "").toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc")  props = [...props].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") props = [...props].sort((a, b) => b.price - a.price);

    setProperties(props);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [apiQuery, page, city, sort, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [city, sort, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Premium Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        {/* Accent blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nova-red/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-nova-orange/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nova-red via-nova-orange to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-nova-red/20 text-nova-red border border-nova-red/30 mb-5 backdrop-blur-sm">
              <Home className="h-3.5 w-3.5" /> {badge}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-white/60 text-base max-w-xl mb-6">{subtitle}</p>

            {/* Stats row */}
            {!loading && (
              <div className="flex items-center gap-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-nova-red animate-pulse" />
                  <span className="text-nova-red font-bold text-sm">{total} bien{total !== 1 ? "s" : ""} disponible{total !== 1 ? "s" : ""}</span>
                </motion.div>
                {city && (
                  <span className="flex items-center gap-1.5 text-white/50 text-sm">
                    <MapPin className="h-3.5 w-3.5" /> {city}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Filters ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, ville, quartier…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* City */}
          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-nova-red/50 transition-all appearance-none cursor-pointer min-w-[150px]">
            <option value="">Toutes les villes</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-nova-red/50 transition-all appearance-none cursor-pointer min-w-[160px]">
            <option value="newest">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>

          {(city || search) && (
            <button onClick={() => { setCity(""); setSearch(""); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
              <X className="h-3.5 w-3.5" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
              <Home className="h-8 w-8 text-nova-red/40" />
            </div>
            <p className="text-gray-700 font-bold text-lg mb-2">{emptyMessage}</p>
            <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            {(search || city) && (
              <button onClick={() => { setSearch(""); setCity(""); }}
                className="mt-5 px-6 py-2.5 bg-gradient-to-r from-nova-red to-nova-orange text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-orange-300/40 transition-all">
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${city}-${sort}-${search}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {properties.map((p) => <PropertyCard key={p.id} property={p} whatsapp={whatsapp} />)}
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
