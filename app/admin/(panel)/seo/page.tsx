"use client";

import { useEffect, useState } from "react";
import { Search, Save, Loader2, Globe, FileText, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const PAGES = [
  { slug: "home",                    label: "Accueil",             path: "/" },
  { slug: "about",                   label: "À propos",            path: "/about" },
  { slug: "services",                label: "Services",            path: "/services" },
  { slug: "contact",                 label: "Contact",             path: "/contact" },
  { slug: "automobile",              label: "Automobiles",         path: "/automobile" },
  { slug: "immobilier",              label: "Immobilier",          path: "/immobilier" },
  { slug: "blog",                    label: "Blog",                path: "/blog" },
  { slug: "annonces",                label: "Annonces",            path: "/annonces" },
  { slug: "faq",                     label: "FAQ",                 path: "/faq" },
  { slug: "confidentialite",         label: "Confidentialité",     path: "/confidentialite" },
  { slug: "cgu",                     label: "CGU",                 path: "/cgu" },
  { slug: "services/location-voiture",   label: "Location Voiture",    path: "/services/location-voiture" },
  { slug: "services/location-immo",     label: "Location Immobilier", path: "/services/location-immo" },
  { slug: "services/achat-vente-immo",  label: "Achat/Vente Immo",    path: "/services/achat-vente-immo" },
  { slug: "services/pieces-auto",        label: "Pièces Auto",         path: "/services/pieces-auto" },
  { slug: "services/flotte",             label: "Gestion Flotte",      path: "/services/flotte" },
];

interface SeoData {
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
  canonical: string;
  noIndex: boolean;
}

const EMPTY: SeoData = { seoTitle: "", metaDescription: "", ogImage: "", canonical: "", noIndex: false };

function charColor(len: number, min: number, max: number) {
  if (len === 0) return "text-white/20";
  if (len < min || len > max) return "text-red-400";
  return "text-green-400";
}

export default function SeoAdmin() {
  const [activeSlug, setActiveSlug] = useState("home");
  const [seoData, setSeoData] = useState<SeoData>(EMPTY);
  const [globalSettings, setGlobalSettings] = useState({ siteName: "NOVA", defaultOgImage: "", googleVerification: "", analyticsId: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages?slug=${activeSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setSeoData({
            seoTitle: data.seoTitle || "",
            metaDescription: data.metaDescription || "",
            ogImage: (data as any).ogImage || "",
            canonical: (data as any).canonical || "",
            noIndex: (data as any).noIndex || false,
          });
        } else {
          setSeoData(EMPTY);
        }
        setLoading(false);
      })
      .catch(() => { setSeoData(EMPTY); setLoading(false); });
  }, [activeSlug]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: activeSlug, ...seoData }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (key: keyof SeoData, value: string | boolean) =>
    setSeoData(d => ({ ...d, [key]: value }));

  const activePage = PAGES.find(p => p.slug === activeSlug);
  const titleLen = seoData.seoTitle.length;
  const descLen = seoData.metaDescription.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Search size={20} className="text-nova-red" /> SEO Manager
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Optimisez le référencement de chaque page</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-nova-red/20">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saved ? "✓ Sauvegardé !" : "Sauvegarder"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Page list */}
        <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden h-fit">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">Pages</p>
          </div>
          {PAGES.map(p => (
            <button key={p.slug} onClick={() => setActiveSlug(p.slug)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 transition-colors flex items-center gap-2 ${activeSlug === p.slug ? "bg-nova-red/10 text-nova-red border-l-2 border-nova-red" : "text-white/60 hover:bg-white/[0.03]"}`}>
              <Globe size={13} className="flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-white/25 text-xs">{p.path}</p>
              </div>
            </button>
          ))}
        </div>

        {/* SEO editor */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
          ) : (
            <>
              {/* SERP preview */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
                <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3 mb-4">Aperçu Google</h2>
                <div className="bg-white rounded-xl p-4 font-sans">
                  <p className="text-xs text-green-700 mb-1">
                    nova.ci{activePage?.path}
                  </p>
                  <p className="text-blue-700 text-lg font-medium leading-snug hover:underline cursor-pointer">
                    {seoData.seoTitle || `${activePage?.label} — NOVA`}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    {seoData.metaDescription || "Ajoutez une description pour améliorer votre CTR dans Google."}
                  </p>
                </div>
              </div>

              {/* Meta fields */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
                <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Balises meta</h2>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-white/60">Titre SEO</label>
                    <span className={`text-xs font-mono ${charColor(titleLen, 30, 60)}`}>{titleLen}/60</span>
                  </div>
                  <input value={seoData.seoTitle} onChange={e => set("seoTitle", e.target.value)}
                    placeholder={`${activePage?.label} — NOVA | Automobile & Immobilier Côte d'Ivoire`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
                  {titleLen > 0 && titleLen < 30 && <p className="text-xs text-amber-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> Titre trop court (min. 30 caractères)</p>}
                  {titleLen > 60 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> Titre trop long (max. 60 caractères)</p>}
                  {titleLen >= 30 && titleLen <= 60 && <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><CheckCircle size={11} /> Longueur optimale</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-white/60">Meta description</label>
                    <span className={`text-xs font-mono ${charColor(descLen, 120, 160)}`}>{descLen}/160</span>
                  </div>
                  <textarea value={seoData.metaDescription} onChange={e => set("metaDescription", e.target.value)} rows={3}
                    placeholder="Description de la page pour les moteurs de recherche (120-160 caractères recommandés)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors" />
                  {descLen > 0 && descLen < 120 && <p className="text-xs text-amber-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> Description trop courte (min. 120 caractères)</p>}
                  {descLen > 160 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} /> Description trop longue (max. 160 caractères)</p>}
                </div>
              </div>

              {/* Open Graph */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
                <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Open Graph (partage réseaux sociaux)</h2>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Image OG (1200×630 recommandé)</label>
                  <ImageUploader
                    value={seoData.ogImage ? [seoData.ogImage] : []}
                    onChange={urls => set("ogImage", urls[0] || "")}
                    maxFiles={1} label="" />
                </div>
              </div>

              {/* Advanced */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
                <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Avancé</h2>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">URL canonique</label>
                  <input value={seoData.canonical} onChange={e => set("canonical", e.target.value)}
                    placeholder={`https://nova.ci${activePage?.path}`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set("noIndex", !seoData.noIndex)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${seoData.noIndex ? "bg-red-500" : "bg-white/10"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${seoData.noIndex ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Masquer aux moteurs de recherche (noindex)</p>
                    <p className="text-xs text-white/30">Activer pour les pages brouillon ou privées</p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
