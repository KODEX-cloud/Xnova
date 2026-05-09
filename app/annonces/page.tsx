"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Car, Building2, BookOpen, Phone, Plus, User,
  Search, MapPin, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  X, Eye, Zap, Star, Crown, ArrowRight, Menu, Filter,
  Bed, Bath, Maximize, Fuel, Gauge, Settings2,
  MessageCircle, ExternalLink, LayoutGrid, List,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Listing {
  id: string; slug: string; kind: "AUTO" | "IMMO";
  title: string; price: number; priceType: string;
  city: string | null; images: string; badge: string | null;
  planType: string; isBoosted: boolean; category: string | null; year: number | null;
  createdAt: string; views: number; description: string | null;
  details: Record<string, any>;
}

interface ListingsResponse {
  listings: Listing[]; total: number; page: number; pages: number;
  counts: { auto: number; immo: number };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CITIES = ["Abidjan", "Yamoussoukro", "Bouaké", "San-Pédro", "Daloa", "Korhogo", "Man", "Gagnoa", "Divo", "Soubré"];

const NAV_LINKS = [
  { label: "Accueil",     href: "/",          Icon: Home },
  { label: "Automobile",  href: "/automobile/vente", Icon: Car },
  { label: "Immobilier",  href: "/immobilier/vente", Icon: Building2 },
  { label: "Annonces",    href: "/annonces",   Icon: LayoutGrid, active: true },
  { label: "Blog",        href: "/blog",       Icon: BookOpen },
  { label: "Contact",     href: "/contact",    Icon: Phone },
];

function getImages(raw: string): string[] {
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
}

function fmtPrice(price: number, priceType: string) {
  const v = Number(price).toLocaleString("fr-FR");
  return priceType === "RENT" ? `${v} FCFA/mois` : `${v} FCFA`;
}

// ── Badge component ───────────────────────────────────────────────────────────

function Badge({ planType, isBoosted }: { planType: string; isBoosted: boolean }) {
  if (planType === "PREMIUM" || isBoosted)
    return <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-900 shadow-lg"><Crown className="h-3 w-3" />Premium</span>;
  if (planType === "EN_AVANT")
    return <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-lg"><Zap className="h-3 w-3" />En avant</span>;
  return null;
}

// ── Listing Card ──────────────────────────────────────────────────────────────

function ListingCard({ item, onClick }: { item: Listing; onClick: () => void }) {
  const imgs = getImages(item.images);
  const thumb = imgs[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb} alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {item.kind === "AUTO"
              ? <Car className="h-12 w-12 text-gray-300" />
              : <Building2 className="h-12 w-12 text-gray-300" />}
          </div>
        )}
        <Badge planType={item.planType} isBoosted={item.isBoosted} />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
            item.kind === "AUTO" ? "bg-blue-500/90 text-white" : "bg-emerald-500/90 text-white"
          }`}>
            {item.kind === "AUTO" ? "Auto" : "Immo"}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Eye className="h-3.5 w-3.5" /> Voir les détails
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-gray-800 font-bold text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-nova-red transition-colors">{item.title}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{item.city || "Côte d'Ivoire"}</span>
          {item.year && <><span className="text-gray-200">·</span><span>{item.year}</span></>}
        </div>
        {/* Sub-details */}
        {item.kind === "AUTO" && (item.details.fuel || item.details.mileage) && (
          <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
            {item.details.fuel && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{item.details.fuel}</span>}
            {item.details.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{Number(item.details.mileage).toLocaleString("fr-FR")} km</span>}
          </div>
        )}
        {item.kind === "IMMO" && (item.details.bedrooms || item.details.surface) && (
          <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
            {item.details.bedrooms && <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{item.details.bedrooms} ch.</span>}
            {item.details.surface && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{item.details.surface} m²</span>}
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-nova-red font-black text-base">{fmtPrice(item.price, item.priceType)}</p>
          <span className="flex items-center gap-0.5 text-gray-300 text-xs"><Eye className="h-3 w-3" />{item.views}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function ListingModal({ item, onClose }: { item: Listing; onClose: () => void }) {
  const imgs = getImages(item.images);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setImgIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setImgIdx((i) => Math.min(imgs.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgs.length, onClose]);

  const whatsapp = `https://wa.me/2250700000000?text=${encodeURIComponent(`Bonjour, je suis intéressé par l'annonce "${item.title}" sur NOVA Marketplace.`)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Left — images */}
          <div className="relative md:w-[55%] h-64 md:h-auto bg-gray-900 flex-shrink-0">
            {imgs.length > 0 ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
                {imgs.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setImgIdx((i) => Math.min(imgs.length - 1, i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {imgs.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                {item.kind === "AUTO" ? <Car className="h-20 w-20 text-gray-500" /> : <Building2 className="h-20 w-20 text-gray-500" />}
              </div>
            )}
            {/* Badge */}
            <div className="absolute top-4 left-4"><Badge planType={item.planType} isBoosted={item.isBoosted} /></div>
            <div className="absolute top-4 right-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.kind === "AUTO" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"}`}>
                {item.kind === "AUTO" ? "Automobile" : "Immobilier"}
              </span>
            </div>
            {imgs.length > 1 && (
              <div className="absolute bottom-12 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                {imgIdx + 1}/{imgs.length}
              </div>
            )}
          </div>

          {/* Right — details */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-gray-900 font-black text-xl leading-tight">{item.title}</h2>
              <button onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Price */}
            <p className="text-nova-red font-black text-2xl mb-2">{fmtPrice(item.price, item.priceType)}</p>

            {/* Location + views */}
            <div className="flex items-center gap-3 text-gray-400 text-sm mb-5">
              {item.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.city}</span>}
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{item.views} vues</span>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {item.kind === "AUTO" && Object.entries({
                Marque: item.details.brand, Modèle: item.details.model,
                Année: item.year, Carburant: item.details.fuel,
                Kilométrage: item.details.mileage ? `${Number(item.details.mileage).toLocaleString("fr-FR")} km` : null,
                Transmission: item.details.transmission, Couleur: item.details.color,
                État: item.details.condition,
              }).filter(([, v]) => v != null).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-gray-800 font-semibold text-sm">{String(v)}</p>
                </div>
              ))}
              {item.kind === "IMMO" && Object.entries({
                Type: item.details.type, Chambres: item.details.bedrooms,
                Salles: item.details.bathrooms,
                Surface: item.details.surface ? `${item.details.surface} m²` : null,
                Terrain: item.details.land ? `${item.details.land} m²` : null,
                Quartier: item.details.district,
              }).filter(([, v]) => v != null).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-gray-800 font-semibold text-sm">{String(v)}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-5">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Description</p>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{item.description}</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-100">
              <a href={whatsapp} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-black text-sm hover:bg-[#1db954] transition-colors shadow-lg shadow-green-500/20">
                <MessageCircle className="h-5 w-5" /> Contacter sur WhatsApp
              </a>
              <Link href={`/${item.kind === "AUTO" ? "automobile" : "immobilier"}/${item.slug}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-nova-red hover:text-nova-red transition-colors">
                <ExternalLink className="h-4 w-4" /> Voir la fiche complète
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function AnnoncesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // State
  const [listings,  setListings]  = useState<Listing[]>([]);
  const [counts,    setCounts]    = useState({ auto: 0, immo: 0 });
  const [total,     setTotal]     = useState(0);
  const [pages,     setPages]     = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<Listing | null>(null);
  const [sideOpen,  setSideOpen]  = useState(false);

  // Filter state
  const [kind,     setKind]     = useState(searchParams.get("kind")  || "ALL");
  const [sort,     setSort]     = useState(searchParams.get("sort")  || "recent");
  const [city,     setCity]     = useState(searchParams.get("city")  || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("min")   || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("max")   || "");
  const [priceType,setPriceType]= useState(searchParams.get("pt")    || "");
  const [category, setCategory] = useState(searchParams.get("cat")   || "");
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    const q = new URLSearchParams({
      kind, sort, page: String(p), limit: "24",
      ...(city      ? { city }      : {}),
      ...(priceMin  ? { priceMin }  : {}),
      ...(priceMax  ? { priceMax }  : {}),
      ...(priceType ? { priceType } : {}),
      ...(category  ? { category }  : {}),
    });
    try {
      const res = await fetch(`/api/annonces?${q}`);
      const data: ListingsResponse = await res.json();
      setListings(data.listings || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setCounts(data.counts || { auto: 0, immo: 0 });
    } catch {}
    setLoading(false);
  }, [kind, sort, city, priceMin, priceMax, priceType, category]);

  useEffect(() => { setPage(1); load(1); }, [load]);

  const displayed = search
    ? listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()))
    : listings;

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className={`
      fixed left-0 top-0 h-full z-50 flex flex-col
      w-72 bg-[#0a0b14]/95 backdrop-blur-xl border-r border-white/8
      transition-transform duration-300
      ${sideOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:z-auto
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <span className="text-white font-black text-xl">NOVA</span>
        </Link>
        <button onClick={() => setSideOpen(false)} className="lg:hidden text-white/40 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {/* Navigation */}
        <div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
          <nav className="space-y-0.5">
            {NAV_LINKS.map(({ label, href, Icon, active: isActive }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-nova-red/20 text-nova-red border border-nova-red/20"
                    : "text-white/50 hover:text-white hover:bg-white/6"
                }`}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-red" />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick filters — Kind */}
        <div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Type d'annonce</p>
          <div className="space-y-1">
            {[
              { v: "ALL",  label: "Toutes les annonces", count: counts.auto + counts.immo },
              { v: "AUTO", label: "Automobile",          count: counts.auto, Icon: Car },
              { v: "IMMO", label: "Immobilier",          count: counts.immo, Icon: Building2 },
            ].map(({ v, label, count, Icon: Ic }) => (
              <button key={v} onClick={() => { setKind(v); setSideOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  kind === v ? "bg-nova-red/15 text-nova-red border border-nova-red/20" : "text-white/50 hover:text-white hover:bg-white/6"
                }`}>
                <span className="flex items-center gap-2">
                  {Ic && <Ic className="h-3.5 w-3.5" />}
                  {label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${kind === v ? "bg-nova-red/20 text-nova-red" : "bg-white/8 text-white/30"}`}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* City filter */}
        <div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Localisation</p>
          <div className="px-2">
            <div className="relative mb-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/6 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-nova-red/50 appearance-none">
                <option value="">Toutes les villes</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Price filter */}
        <div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Budget</p>
          <div className="px-2 space-y-2">
            <input value={priceMin} onChange={(e) => setPriceMin(e.target.value)} type="number" placeholder="Prix min (FCFA)"
              className="w-full px-3 py-2.5 bg-white/6 border border-white/10 rounded-xl text-white/70 text-sm placeholder-white/25 focus:outline-none focus:border-nova-red/50" />
            <input value={priceMax} onChange={(e) => setPriceMax(e.target.value)} type="number" placeholder="Prix max (FCFA)"
              className="w-full px-3 py-2.5 bg-white/6 border border-white/10 rounded-xl text-white/70 text-sm placeholder-white/25 focus:outline-none focus:border-nova-red/50" />
          </div>
        </div>

        {/* Transaction type */}
        <div>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Transaction</p>
          <div className="px-2 grid grid-cols-3 gap-1.5">
            {[{ v: "", l: "Tous" }, { v: "SALE", l: "Vente" }, { v: "RENT", l: "Location" }].map(({ v, l }) => (
              <button key={v} onClick={() => setPriceType(v)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  priceType === v ? "bg-nova-red text-white" : "bg-white/6 text-white/50 hover:bg-white/12"
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {/* Apply / Reset */}
        <div className="px-2 space-y-2 pb-4">
          <button onClick={() => { load(1); setSideOpen(false); }}
            className="w-full py-3 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            Appliquer les filtres
          </button>
          <button onClick={() => { setCity(""); setPriceMin(""); setPriceMax(""); setPriceType(""); setCategory(""); setKind("ALL"); }}
            className="w-full py-2.5 bg-white/6 text-white/40 font-medium rounded-xl text-sm hover:text-white/60 transition-all">
            Réinitialiser
          </button>
        </div>
      </div>
    </aside>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar overlay on mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-0">

        {/* Top header */}
        <header className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-3 px-4 h-16">
            {/* Burger (mobile) */}
            <button onClick={() => setSideOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0">
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo on mobile */}
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center">
                <span className="text-white font-black text-xs">N</span>
              </div>
              <span className="text-nova-red font-black text-lg">NOVA</span>
            </Link>

            {/* Search bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une annonce…"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-nova-red/50 focus:bg-white transition-all"
              />
            </div>

            {/* Sort */}
            <div className="hidden sm:flex items-center gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-nova-red/50 appearance-none cursor-pointer">
                <option value="recent">Plus récent</option>
                <option value="boost">Boostées</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>

            {/* Filter btn (mobile) */}
            <button onClick={() => setSideOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm hover:border-nova-red/50 transition-colors">
              <Filter className="h-4 w-4" />
            </button>

            {/* Right CTA */}
            <div className="hidden sm:flex items-center gap-2 ml-auto flex-shrink-0">
              <Link href="/auth/login"
                className="flex items-center gap-1.5 px-3.5 py-2 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all">
                <User className="h-4 w-4" /> Mon espace
              </Link>
              <Link href="/publier"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-orange-300/50 hover:scale-[1.02] transition-all">
                <Plus className="h-4 w-4" /> Publier
              </Link>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">

            {/* Page title + count */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-black text-gray-900">
                  {kind === "AUTO" ? "Annonces Automobile" : kind === "IMMO" ? "Annonces Immobilier" : "Toutes les annonces"}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {loading ? "Chargement…" : `${total.toLocaleString("fr-FR")} annonce${total !== 1 ? "s" : ""} trouvée${total !== 1 ? "s" : ""}`}
                </p>
              </div>
              {/* Kind tabs */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {[{ v: "ALL", l: "Tout" }, { v: "AUTO", l: "Auto" }, { v: "IMMO", l: "Immo" }].map(({ v, l }) => (
                  <button key={v} onClick={() => setKind(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      kind === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}>{l}</button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-48 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                      <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                      <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h2 className="text-gray-700 font-bold text-lg mb-2">Aucune annonce trouvée</h2>
                <p className="text-gray-400 text-sm max-w-xs">Modifiez vos filtres pour voir plus de résultats.</p>
                <button onClick={() => { setCity(""); setPriceMin(""); setPriceMax(""); setKind("ALL"); setSearch(""); }}
                  className="mt-6 px-6 py-2.5 bg-nova-red text-white font-bold rounded-xl text-sm hover:bg-nova-orange transition-colors">
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {displayed.map((item) => (
                    <ListingCard key={item.id} item={item} onClick={() => setSelected(item)} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => { setPage((p) => Math.max(1, p - 1)); load(Math.max(1, page - 1)); }}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-nova-red/50 hover:text-nova-red disabled:opacity-40 transition-all">
                  <ChevronLeft className="h-4 w-4" /> Précédent
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, pages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} onClick={() => { setPage(p); load(p); }}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                          p === page ? "bg-nova-red text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}>{p}</button>
                    );
                  })}
                </div>
                <button onClick={() => { setPage((p) => Math.min(pages, p + 1)); load(Math.min(pages, page + 1)); }}
                  disabled={page === pages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-nova-red/50 hover:text-nova-red disabled:opacity-40 transition-all">
                  Suivant <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && <ListingModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function AnnoncesPage() {
  return (
    <Suspense>
      <AnnoncesContent />
    </Suspense>
  );
}
