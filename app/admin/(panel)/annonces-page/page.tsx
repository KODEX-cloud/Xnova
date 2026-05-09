"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutGrid, Save, Loader2, Check, Eye, SlidersHorizontal,
  Palette, Navigation, ExternalLink, RefreshCw, Car, Building2,
} from "lucide-react";

// ── Settings interface ────────────────────────────────────────────────────────

interface AnnoncesConfig {
  defaultKind:        string; // ALL | AUTO | IMMO
  defaultSort:        string; // recent | price_asc | price_desc | boost
  pageSize:           string; // 12 | 24 | 36
  showHero:           string; // true | false
  heroTitle:          string;
  heroSubtitle:       string;
  heroBg:             string; // gradient color 1
  sidebarBg:          string; // dark | slate | navy
  cardStyle:          string; // default | minimal | glass
  showAutoCount:      string; // true | false
  showImmoCount:      string; // true | false
  enablePriceFilter:  string;
  enableCityFilter:   string;
  enableTypeFilter:   string;
  featuredLabel:      string;
  navItems:           string; // JSON array of enabled nav items
}

const DEFAULTS: AnnoncesConfig = {
  defaultKind:       "ALL",
  defaultSort:       "recent",
  pageSize:          "24",
  showHero:          "false",
  heroTitle:         "Toutes les annonces NOVA",
  heroSubtitle:      "Découvrez des milliers d'annonces automobile & immobilier en Côte d'Ivoire.",
  heroBg:            "#F97316",
  sidebarBg:         "dark",
  cardStyle:         "default",
  showAutoCount:     "true",
  showImmoCount:     "true",
  enablePriceFilter: "true",
  enableCityFilter:  "true",
  enableTypeFilter:  "true",
  featuredLabel:     "Premium",
  navItems:          JSON.stringify(["Accueil", "Automobile", "Immobilier", "Annonces", "Blog", "Contact"]),
};

const KEY_PREFIX = "annonces.";

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminAnnoncesPagePanel() {
  const [cfg,    setCfg]    = useState<AnnoncesConfig>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const [tab,    setTab]    = useState<"display" | "design" | "filters" | "nav">("display");

  // Load existing settings
  useEffect(() => {
    fetch("/api/settings?prefix=annonces.")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data && typeof data === "object") {
          setCfg((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof AnnoncesConfig) => (val: string) =>
    setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const body: Record<string, string> = {};
      for (const [k, v] of Object.entries(cfg)) {
        body[`${KEY_PREFIX}${k}`] = String(v);
      }
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setError("Erreur lors de la sauvegarde."); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Erreur réseau."); }
    finally { setSaving(false); }
  };

  const boolField = (key: keyof AnnoncesConfig, label: string, hint?: string) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-gray-800 text-sm font-semibold">{label}</p>
        {hint && <p className="text-gray-400 text-xs mt-0.5">{hint}</p>}
      </div>
      <button onClick={() => set(key)(cfg[key] === "true" ? "false" : "true")}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${cfg[key] === "true" ? "bg-nova-red" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${cfg[key] === "true" ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );

  const selectField = (key: keyof AnnoncesConfig, label: string, options: { v: string; l: string }[]) => (
    <div>
      <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
      <select value={cfg[key]} onChange={(e) => set(key)(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-nova-red/50 transition-all">
        {options.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  const textField = (key: keyof AnnoncesConfig, label: string, placeholder?: string) => (
    <div>
      <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
      <input type="text" value={cfg[key]} onChange={(e) => set(key)(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-nova-red/50 transition-all" />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-nova-red" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Page Annonces</h1>
            <p className="text-gray-500 text-sm">Paramètres de la page <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/annonces</code></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/annonces" target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-all">
            <ExternalLink className="h-4 w-4" /> Voir la page
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-orange-300/40 disabled:opacity-60 transition-all">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Sauvegarde…" : saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>

      {error && <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: "display", label: "Affichage",  Icon: Eye },
          { key: "design",  label: "Design",     Icon: Palette },
          { key: "filters", label: "Filtres",    Icon: SlidersHorizontal },
          { key: "nav",     label: "Navigation", Icon: Navigation },
        ].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Icon className="h-4 w-4" /> <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 space-y-5">

        {/* ── DISPLAY ── */}
        {tab === "display" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Paramètres d'affichage</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {selectField("defaultKind", "Type d'annonce par défaut", [
                { v: "ALL",  l: "Toutes les annonces" },
                { v: "AUTO", l: "Automobile seulement" },
                { v: "IMMO", l: "Immobilier seulement" },
              ])}
              {selectField("defaultSort", "Tri par défaut", [
                { v: "recent",     l: "Plus récent" },
                { v: "boost",      l: "Boostées en premier" },
                { v: "price_asc",  l: "Prix croissant" },
                { v: "price_desc", l: "Prix décroissant" },
              ])}
              {selectField("pageSize", "Annonces par page", [
                { v: "12", l: "12 annonces" },
                { v: "24", l: "24 annonces (recommandé)" },
                { v: "36", l: "36 annonces" },
              ])}
            </div>

            <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
              {boolField("showAutoCount", "Afficher le compteur Automobile", "Nombre d'annonces auto dans la sidebar")}
              {boolField("showImmoCount", "Afficher le compteur Immobilier", "Nombre d'annonces immo dans la sidebar")}
            </div>

            <div>
              <h3 className="text-gray-700 text-sm font-bold mb-3">Bannière hero (optionnel)</h3>
              <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
                {boolField("showHero", "Afficher une bannière en haut", "Ajoute un titre et sous-titre sur la page")}
              </div>
              {cfg.showHero === "true" && (
                <div className="mt-4 space-y-3">
                  {textField("heroTitle", "Titre de la bannière", "Toutes les annonces NOVA")}
                  {textField("heroSubtitle", "Sous-titre", "Découvrez des milliers d'annonces…")}
                  <div>
                    <label className="text-gray-700 text-sm font-semibold block mb-1.5">Couleur de fond du hero</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={cfg.heroBg} onChange={(e) => set("heroBg")(e.target.value)}
                        className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer" />
                      <div className="flex-1 h-10 rounded-xl border border-gray-200 flex items-center px-3"
                        style={{ background: `linear-gradient(135deg, ${cfg.heroBg}, ${cfg.heroBg}dd)` }}>
                        <span className="text-white font-bold text-xs drop-shadow">{cfg.heroTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── DESIGN ── */}
        {tab === "design" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Style visuel</h2>

            {selectField("sidebarBg", "Style de la sidebar", [
              { v: "dark",  l: "Sombre (noir) — recommandé" },
              { v: "slate", l: "Ardoise (slate-800)" },
              { v: "navy",  l: "Marine (bleu foncé)" },
            ])}

            {selectField("cardStyle", "Style des cartes", [
              { v: "default", l: "Standard (ombre légère)" },
              { v: "minimal", l: "Minimal (bordure fine)" },
              { v: "glass",   l: "Glass (transparence)" },
            ])}

            {textField("featuredLabel", "Label badge Premium", "Premium")}

            {/* Preview cards */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-3">Aperçu carte</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className={`rounded-2xl overflow-hidden border ${cfg.cardStyle === "glass" ? "bg-white/60 backdrop-blur border-white/40 shadow-xl" : cfg.cardStyle === "minimal" ? "bg-white border-gray-200" : "bg-white border-gray-100 shadow-md"}`}>
                  <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-gray-800 font-bold text-xs mb-1">Toyota Corolla 2021</p>
                    <p className="text-nova-red font-black text-sm">8 500 000 FCFA</p>
                  </div>
                </div>
                <div className={`rounded-2xl overflow-hidden border ${cfg.cardStyle === "glass" ? "bg-white/60 backdrop-blur border-white/40 shadow-xl" : cfg.cardStyle === "minimal" ? "bg-white border-gray-200" : "bg-white border-gray-100 shadow-md"}`}>
                  <div className="h-28 bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="p-3">
                    <p className="text-gray-800 font-bold text-xs mb-1">Villa 4 pièces Cocody</p>
                    <p className="text-nova-red font-black text-sm">120 000 000 FCFA</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── FILTERS ── */}
        {tab === "filters" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Filtres disponibles</h2>
            <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
              {boolField("enablePriceFilter", "Filtre par prix", "Afficher les champs prix min/max dans la sidebar")}
              {boolField("enableCityFilter",  "Filtre par ville", "Afficher le menu déroulant de ville")}
              {boolField("enableTypeFilter",  "Filtre par type de transaction", "Vente / Location / Tous")}
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-700">
              <p className="font-semibold mb-1">Note :</p>
              <p>Les filtres de type d'annonce (Auto / Immo) sont toujours affichés car ils permettent la navigation principale.</p>
            </div>
          </motion.div>
        )}

        {/* ── NAV ── */}
        {tab === "nav" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Menu de navigation (sidebar)</h2>
            <p className="text-gray-500 text-sm">Sélectionnez les éléments à afficher dans le menu latéral de la page annonces.</p>
            <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
              {[
                { label: "Accueil",    href: "/" },
                { label: "Automobile", href: "/automobile/vente" },
                { label: "Immobilier", href: "/immobilier/vente" },
                { label: "Annonces",   href: "/annonces" },
                { label: "Blog",       href: "/blog" },
                { label: "Contact",    href: "/contact" },
              ].map(({ label, href }) => {
                const items: string[] = (() => { try { return JSON.parse(cfg.navItems); } catch { return []; } })();
                const enabled = items.includes(label);
                return (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-gray-800 text-sm font-semibold">{label}</p>
                      <p className="text-gray-400 text-xs">{href}</p>
                    </div>
                    <button
                      onClick={() => {
                        const current: string[] = (() => { try { return JSON.parse(cfg.navItems); } catch { return []; } })();
                        const next = enabled ? current.filter((i) => i !== label) : [...current, label];
                        set("navItems")(JSON.stringify(next));
                      }}
                      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-nova-red" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
