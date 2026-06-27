"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Car, Home, MapPin, ChevronDown, ArrowRight,
  Star, CheckCircle2, Shield, Zap, TrendingUp,
} from "lucide-react";

const CITIES = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Treichville", "Bouaké", "Yamoussoukro"];

const TRUST_PILLS = [
  { icon: CheckCircle2, label: "Annonces vérifiées", color: "text-emerald-600" },
  { icon: Shield, label: "Paiement sécurisé", color: "text-blue-600" },
  { icon: Zap, label: "Réponse en 2h", color: "text-nova-red" },
];

const FLOAT_STATS = [
  { value: "1 200+", label: "Voitures" },
  { value: "800+", label: "Biens immo" },
  { value: "98%", label: "Satisfaction" },
];

const ACTIVITY = [
  { action: "Nouvelle BMW X5 publiée", time: "il y a 2 min", dot: "bg-emerald-400" },
  { action: "Villa Cocody réservée", time: "il y a 8 min", dot: "bg-nova-red" },
  { action: "3 offres sur Mercedes", time: "il y a 15 min", dot: "bg-blue-400" },
];

export default function HomeHeroSection() {
  const router = useRouter();
  const [tab, setTab] = useState<"auto" | "immo">("auto");
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const base = tab === "auto" ? "/automobile/vente" : "/immobilier/vente";
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (city) params.set("city", city);
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/70 to-rose-50/50" />
        <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-gradient-radial from-orange-200/50 to-transparent rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[100px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #F97316 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }}
        />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nova-red via-nova-orange to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[calc(100vh-5rem)] py-16 lg:py-24">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="order-2 lg:order-1">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-rose-100 border border-orange-200 text-nova-red text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
            >
              <Star className="h-3.5 w-3.5 fill-nova-red" />
              Marketplace #1 · Côte d'Ivoire
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-[3.6rem] font-black text-gray-900 leading-[1.08] mb-6 tracking-tight"
            >
              Trouvez votre{" "}
              <span className="gradient-text-nova">voiture</span>{" "}
              ou votre{" "}
              <span className="relative inline-block">
                <span className="gradient-text-nova">bien immobilier</span>
                {/* Underline accent */}
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                  <path d="M0 5 Q75 0 150 5 Q225 10 300 5" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
              {" "}en toute confiance
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl"
            >
              Achetez, louez ou investissez avec <strong className="text-gray-800 font-bold">NOVA</strong> — le marketplace premium de Côte d'Ivoire. Plus de <strong className="text-gray-800">2 000 annonces</strong> vérifiées.
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap gap-2.5 mb-10"
            >
              {TRUST_PILLS.map(({ icon: Icon, label, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-semibold shadow-sm"
                >
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Search box */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-3 shadow-xl shadow-gray-200/70 ring-1 ring-gray-100/80">
                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-3">
                  {(["auto", "immo"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        tab === t
                          ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-lg shadow-orange-200/60"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t === "auto" ? <Car className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                      {t === "auto" ? "Automobile" : "Immobilier"}
                    </button>
                  ))}
                </div>
                {/* Fields */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder={tab === "auto" ? "BMW, Mercedes, Toyota…" : "Villa, appartement, terrain…"}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-nova-red/40 focus:bg-white focus:ring-2 focus:ring-nova-red/10 transition-all"
                    />
                  </div>
                  <div className="relative sm:w-44">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-8 py-3.5 text-gray-800 text-sm focus:outline-none focus:border-nova-red/40 transition-colors cursor-pointer"
                    >
                      <option value="">Toute la CI</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-orange-300/50 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-sm"
                  >
                    <Search className="h-4 w-4" /> Rechercher
                  </button>
                </div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/automobile/vente"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold text-sm transition-all hover:shadow-xl hover:shadow-orange-300/50 hover:scale-105 group"
              >
                <Car className="h-4 w-4" />
                Explorer les voitures
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/immobilier"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-nova-red/30 text-gray-700 font-bold text-sm transition-all hover:shadow-lg hover:scale-105 group"
              >
                <Home className="h-4 w-4" />
                Immobilier
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Floating visual ──────────────────────────────────── */}
          <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end pb-10 lg:pb-0">
            <div className="relative w-full max-w-sm xl:max-w-md">

              {/* Main listing card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 border border-gray-100"
              >
                {/* Visual image area */}
                <div className="h-52 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-nova-red/15 to-nova-orange/10" />
                  {/* Decorative circles */}
                  <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/5 border border-white/10" />
                  <div className="absolute top-16 right-16 w-16 h-16 rounded-full bg-white/5 border border-white/10" />
                  {/* Car emoji + glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-nova-red/20 rounded-full blur-xl scale-150" />
                      <span className="relative text-7xl filter drop-shadow-lg">🚗</span>
                    </div>
                  </div>
                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-nova-red to-nova-orange rounded-full text-white text-xs font-bold shadow-lg">
                    ⚡ Coup de cœur
                  </span>
                  {/* Price overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-white font-black text-lg leading-none">28 500 000 FCFA</p>
                      <p className="text-white/60 text-xs mt-0.5">Vente directe</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-white text-xs font-bold">4.9</span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <p className="text-gray-900 font-black text-base mb-1">BMW X5 2023 — Xdrive 40i</p>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                    <MapPin className="h-3.5 w-3.5 text-nova-red flex-shrink-0" />
                    Cocody, Abidjan · Automatique
                  </div>
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    {["2023", "Essence", "12 500 km"].map((spec) => (
                      <span key={spec} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-xs font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-nova-red font-black text-lg">28 500 000 FCFA</p>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-nova-red to-nova-orange text-white text-sm font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                      Voir <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Stats floating card — left */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="absolute -left-8 top-1/3 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/80 border border-gray-100 z-10"
              >
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">En chiffres</p>
                {FLOAT_STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-nova-red to-nova-orange flex-shrink-0" />
                    <span className="text-gray-900 font-black text-sm">{s.value}</span>
                    <span className="text-gray-400 text-xs">{s.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Activity card — bottom right */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute -right-6 -bottom-8 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/80 border border-gray-100 z-10 min-w-[210px]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Live</p>
                </div>
                {ACTIVITY.map((a) => (
                  <div key={a.action} className="flex items-start gap-2 mb-2 last:mb-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                    <div>
                      <p className="text-gray-700 text-xs font-medium leading-tight">{a.action}</p>
                      <p className="text-gray-400 text-[10px]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Trending badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 }}
                className="absolute top-4 -right-5 bg-gradient-to-r from-nova-red to-nova-orange text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-orange-300/50 flex items-center gap-1 z-10"
              >
                <TrendingUp className="h-3 w-3" /> Populaire
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-nova-red/50" />
          </div>
          <p className="text-gray-400 text-[10px] font-medium tracking-wider uppercase">Défiler</p>
        </motion.div>
      </div>
    </section>
  );
}
