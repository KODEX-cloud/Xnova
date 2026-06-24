"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Home, Save, Loader2, Check, RefreshCw, Eye, AlertCircle,
  Video, Images, LayoutTemplate, ChevronUp, ChevronDown,
  ToggleLeft, ToggleRight, ExternalLink, Film, Image as ImageIcon,
  Megaphone, Type, Link as LinkIcon, Palette, Plus, Trash2, GripVertical,
} from "lucide-react";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage-keys";
import type { HomepageConfig } from "@/lib/homepage-keys";

// ── Tab IDs ───────────────────────────────────────────────────────────────────

type Tab = "hero" | "sections" | "cta" | "content";

// ── Field components ──────────────────────────────────────────────────────────

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="sm:w-48 flex-shrink-0">
          <p className="text-white text-sm font-medium">{label}</p>
          {description && <p className="text-white/30 text-xs mt-0.5 leading-snug">{description}</p>}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors"
    />
  );
}

function TextArea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors resize-none"
    />
  );
}

// ── Hero Tab ──────────────────────────────────────────────────────────────────

function HeroTab({ config, set }: { config: HomepageConfig; set: (k: keyof HomepageConfig, v: any) => void }) {
  const [slides, setSlides] = useState(config.heroSlides);

  const updateSlides = (s: HomepageConfig["heroSlides"]) => {
    setSlides(s);
    set("heroSlides", s);
  };

  const addSlide = () => updateSlides([...slides, { image: "", title: "", subtitle: "" }]);
  const removeSlide = (i: number) => updateSlides(slides.filter((_, idx) => idx !== i));
  const updateSlide = (i: number, field: "image" | "title" | "subtitle", v: string) => {
    const next = [...slides];
    next[i] = { ...next[i], [field]: v };
    updateSlides(next);
  };

  return (
    <div className="space-y-5">
      {/* Hero type */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <LayoutTemplate size={15} className="text-white/40" /> Type de Hero
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "split",  label: "Split Premium", Icon: LayoutTemplate, desc: "Layout en 2 colonnes avec recherche intégrée" },
            { value: "video",  label: "Vidéo fond",    Icon: Film,            desc: "Vidéo en background full-screen avec overlay" },
            { value: "slider", label: "Slider images", Icon: Images,          desc: "Carousel automatique multi-slides" },
          ].map(({ value, label, Icon, desc }) => (
            <button
              key={value}
              onClick={() => set("heroType", value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                config.heroType === value
                  ? "border-nova-red/60 bg-nova-red/10 text-nova-red"
                  : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-bold">{label}</span>
              <span className="text-[10px] opacity-70 leading-tight">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Type size={15} className="text-white/40" /> Contenu textuel
        </h2>
        <Field label="Badge d'accroche" description="Petite étiquette au-dessus du titre">
          <TextInput value={config.heroBadge} onChange={(v) => set("heroBadge", v)} placeholder="Marketplace #1 · Côte d'Ivoire" />
        </Field>
        <Field label="Titre principal" description="H1 — visible en gros">
          <TextArea value={config.heroTitle} onChange={(v) => set("heroTitle", v)} rows={2} placeholder="Trouvez votre voiture ou votre bien..." />
        </Field>
        <Field label="Sous-titre" description="Texte descriptif sous le titre">
          <TextArea value={config.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} rows={3} placeholder="Achetez, louez ou investissez avec NOVA..." />
        </Field>
      </div>

      {/* CTAs */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <LinkIcon size={15} className="text-white/40" /> Boutons d'action
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Bouton principal</p>
            <div className="space-y-2">
              <TextInput value={config.heroCta1Text} onChange={(v) => set("heroCta1Text", v)} placeholder="Explorer les voitures" />
              <TextInput value={config.heroCta1Link} onChange={(v) => set("heroCta1Link", v)} placeholder="/automobile/vente" />
            </div>
          </div>
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Bouton secondaire</p>
            <div className="space-y-2">
              <TextInput value={config.heroCta2Text} onChange={(v) => set("heroCta2Text", v)} placeholder="Immobilier" />
              <TextInput value={config.heroCta2Link} onChange={(v) => set("heroCta2Link", v)} placeholder="/immobilier" />
            </div>
          </div>
        </div>
      </div>

      {/* Video settings */}
      {config.heroType === "video" && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Video size={15} className="text-white/40" /> Configuration vidéo
          </h2>
          <Field label="URL de la vidéo" description="MP4, WebM — hébergé sur votre serveur ou CDN">
            <TextInput value={config.heroVideoUrl} onChange={(v) => set("heroVideoUrl", v)} placeholder="https://..." />
          </Field>
          <Field label="Opacité overlay" description={`Assombrissement sur la vidéo — actuel : ${Math.round(parseFloat(config.heroOverlay || "0.55") * 100)}%`}>
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="1" step="0.05"
                value={config.heroOverlay}
                onChange={(e) => set("heroOverlay", e.target.value)}
                className="flex-1 accent-nova-red" />
              <span className="text-white/60 text-xs w-10 text-right">{Math.round(parseFloat(config.heroOverlay || "0.55") * 100)}%</span>
            </div>
          </Field>
          <div className="mt-4 p-3 bg-white/[0.03] rounded-lg text-white/40 text-xs">
            <p className="font-medium text-white/60 mb-1">Conseils vidéo :</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>Format MP4 (H.264) recommandé pour compatibilité maximale</li>
              <li>Résolution 1920×1080 minimum — taille max recommandée : 15 Mo</li>
              <li>Pas de son requis (autoplay sans son)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Slider settings */}
      {config.heroType === "slider" && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <Images size={15} className="text-white/40" /> Slides du carousel
          </h2>
          <Field label="Opacité overlay" description={`Assombrissement — ${Math.round(parseFloat(config.heroOverlay || "0.55") * 100)}%`}>
            <div className="flex items-center gap-3">
              <input type="range" min="0" max="1" step="0.05"
                value={config.heroOverlay}
                onChange={(e) => set("heroOverlay", e.target.value)}
                className="flex-1 accent-nova-red" />
              <span className="text-white/60 text-xs w-10 text-right">{Math.round(parseFloat(config.heroOverlay || "0.55") * 100)}%</span>
            </div>
          </Field>

          <div className="mt-4 space-y-4">
            {slides.map((slide, i) => (
              <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Slide {i + 1}</span>
                  <button onClick={() => removeSlide(i)} className="text-red-400/60 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-white/30 text-[10px] font-medium uppercase tracking-wider block mb-1">URL Image</label>
                    <TextInput value={slide.image} onChange={(v) => updateSlide(i, "image", v)} placeholder="https://images.unsplash.com/..." />
                    {slide.image && (
                      <div className="mt-2 h-20 rounded-lg overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={slide.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-white/30 text-[10px] font-medium uppercase tracking-wider block mb-1">Titre de la slide</label>
                    <TextInput value={slide.title} onChange={(v) => updateSlide(i, "title", v)} placeholder="Voitures de Prestige" />
                  </div>
                  <div>
                    <label className="text-white/30 text-[10px] font-medium uppercase tracking-wider block mb-1">Sous-titre</label>
                    <TextInput value={slide.subtitle} onChange={(v) => updateSlide(i, "subtitle", v)} placeholder="Description courte..." />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addSlide}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/10 text-white/30 hover:border-white/20 hover:text-white/50 transition-all text-sm"
            >
              <Plus size={16} /> Ajouter une slide
            </button>
          </div>
        </div>
      )}

      {/* Floating card (split mode) */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <ImageIcon size={15} className="text-white/40" /> Carte flottante (mode Split)
          <label className="ml-auto flex items-center gap-2 cursor-pointer">
            <span className="text-white/40 text-xs">Visible</span>
            <input type="checkbox" checked={config.showHeroCard !== false}
              onChange={e => set("showHeroCard", e.target.checked)}
              className="w-4 h-4 accent-nova-red rounded cursor-pointer" />
          </label>
        </h2>
        <Field label="Badge"><TextInput value={config.heroCardBadge} onChange={v => set("heroCardBadge", v)} placeholder="⚡ Coup de cœur" /></Field>
        <Field label="Titre voiture"><TextInput value={config.heroCardTitle} onChange={v => set("heroCardTitle", v)} placeholder="BMW X5 2023" /></Field>
        <Field label="Prix"><TextInput value={config.heroCardPrice} onChange={v => set("heroCardPrice", v)} placeholder="28 500 000 FCFA" /></Field>
        <Field label="Localisation"><TextInput value={config.heroCardLocation} onChange={v => set("heroCardLocation", v)} placeholder="Cocody, Abidjan · Automatique" /></Field>
        <Field label="Lien bouton"><TextInput value={config.heroCardLink} onChange={v => set("heroCardLink", v)} placeholder="/automobile/vente" /></Field>
        <Field label="Spécifications (séparées par virgule)" description="Ex: 2023, Essence, 12 500 km">
          <TextInput value={(config.heroCardSpecs || []).join(", ")}
            onChange={v => set("heroCardSpecs", v.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="2023, Essence, 12 500 km" />
        </Field>
        <Field label="Badge populaire (vide = masqué)"><TextInput value={config.heroPopularBadge} onChange={v => set("heroPopularBadge", v)} placeholder="Populaire" /></Field>
      </div>

      {/* Trust badges + Hero stats */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Type size={15} className="text-white/40" /> Trust badges &amp; Mini-stats
        </h2>
        <Field label="Mini-stats (JSON)" description='[{"value":"1 200+","label":"Voitures"},...]'>
          <TextArea rows={3} value={JSON.stringify(config.heroStats || [], null, 0)}
            onChange={v => { try { set("heroStats", JSON.parse(v)); } catch {} }}
            placeholder='[{"value":"1 200+","label":"Voitures"}]' />
        </Field>
        <Field label="Activité live (JSON)" description='[{"action":"...","time":"..."}]'>
          <TextArea rows={3} value={JSON.stringify(config.heroActivity || [], null, 0)}
            onChange={v => { try { set("heroActivity", JSON.parse(v)); } catch {} }}
            placeholder='[{"action":"Nouvelle BMW publiée","time":"il y a 2 min"}]' />
        </Field>
        <Field label="Trust badges (JSON)" description='[{"label":"...","icon":"CheckCircle2","color":"text-emerald-600"}]'>
          <TextArea rows={4} value={JSON.stringify(config.heroTrustBadges || [], null, 0)}
            onChange={v => { try { set("heroTrustBadges", JSON.parse(v)); } catch {} }}
            placeholder='[{"label":"Annonces vérifiées","icon":"CheckCircle2","color":"text-emerald-600"}]' />
        </Field>
      </div>
    </div>
  );
}

// ── Sections Tab ──────────────────────────────────────────────────────────────

const SECTION_META: { key: string; label: string; desc: string; Icon: any }[] = [
  { key: "stats",      label: "Statistiques",       desc: "Compteurs animés : voitures, clients, note...",     Icon: Home },
  { key: "categories", label: "Catégories rapides",  desc: "5 cartes de catégorie (auto/immo/location...)",    Icon: LayoutTemplate },
  { key: "offers",     label: "Offres du moment",    desc: "Annonces vedettes depuis la base de données",      Icon: ImageIcon },
  { key: "whyNova",    label: "Pourquoi NOVA",       desc: "6 avantages avec icônes et badges",                Icon: Megaphone },
  { key: "blog",       label: "Blog & Conseils",     desc: "3 derniers articles + newsletter",                 Icon: Type },
  { key: "cta",        label: "Appel à l'action",    desc: "Section bannière avec boutons CTA",                Icon: Megaphone },
];

const ENABLED_KEYS: Record<string, keyof HomepageConfig> = {
  stats: "sectionStats", categories: "sectionCategories", offers: "sectionOffers",
  whyNova: "sectionWhyNova", blog: "sectionBlog", cta: "sectionCta",
};

function SectionsTab({ config, set }: { config: HomepageConfig; set: (k: keyof HomepageConfig, v: any) => void }) {
  const [order, setOrder] = useState<string[]>(config.sectionsOrder);

  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...order];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrder(next);
    set("sectionsOrder", next);
  };

  const moveDown = (i: number) => {
    if (i === order.length - 1) return;
    const next = [...order];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrder(next);
    set("sectionsOrder", next);
  };

  const toggle = (key: string) => {
    const ek = ENABLED_KEYS[key];
    if (ek) set(ek, !config[ek]);
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
          <GripVertical size={15} className="text-white/40" /> Sections — ordre & visibilité
        </h2>
        <p className="text-white/30 text-xs mb-5">
          Activez/désactivez et réordonnez les sections de la page d'accueil. Le Hero est toujours en premier.
        </p>

        <div className="space-y-2">
          {/* Hero — fixed */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-nova-red/20">
            <div className="w-8 h-8 rounded-lg bg-nova-red/15 flex items-center justify-center flex-shrink-0">
              <Home size={15} className="text-nova-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Hero Section</p>
              <p className="text-white/30 text-xs">Toujours visible — configurable dans l'onglet Hero</p>
            </div>
            <span className="text-[10px] text-nova-red font-bold px-2 py-1 bg-nova-red/10 rounded-full">FIXE</span>
          </div>

          {order.map((key, i) => {
            const meta = SECTION_META.find((m) => m.key === key);
            if (!meta) return null;
            const Icon = meta.Icon;
            const ek = ENABLED_KEYS[key];
            const enabled = ek ? (config[ek] as boolean) : true;

            return (
              <div
                key={key}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  enabled ? "bg-white/[0.03] border-white/8" : "bg-white/[0.01] border-white/5 opacity-50"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${enabled ? "text-white" : "text-white/40"}`}>{meta.label}</p>
                  <p className="text-white/30 text-xs truncate">{meta.desc}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === order.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => toggle(key)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${enabled ? "text-emerald-400 hover:bg-emerald-400/10" : "text-white/20 hover:bg-white/5"}`}>
                    {enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-blue-400/70 text-xs">
        <p className="font-semibold mb-1 text-blue-400">Bon à savoir</p>
        Les sections désactivées ne s'affichent pas sur la page d'accueil. Les statistiques, offres et articles blog sont toujours chargés depuis la base de données en temps réel.
      </div>
    </div>
  );
}

// ── CTA Tab ───────────────────────────────────────────────────────────────────

function CtaTab({ config, set }: { config: HomepageConfig; set: (k: keyof HomepageConfig, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Megaphone size={15} className="text-white/40" /> Section Appel à l'action
        </h2>

        <Field label="Pill / Label">
          <TextInput value={config.ctaLabel} onChange={v => set("ctaLabel", v)} placeholder="Rejoignez NOVA" />
        </Field>
        <Field label="Titre" description="Titre principal de la bannière CTA">
          <TextArea value={config.ctaTitle} onChange={(v) => set("ctaTitle", v)} rows={2} placeholder="Prêt à publier votre annonce ?" />
        </Field>
        <Field label="Sous-titre" description="Texte de description">
          <TextArea value={config.ctaSubtitle} onChange={(v) => set("ctaSubtitle", v)} rows={2} placeholder="Rejoignez des milliers de vendeurs..." />
        </Field>

        <Field label="Couleur de fond" description="Couleur de la bannière">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-white/20 overflow-hidden relative" style={{ backgroundColor: config.ctaBg }}>
              <input type="color" value={config.ctaBg} onChange={(e) => set("ctaBg", e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <input type="text" value={config.ctaBg} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) set("ctaBg", e.target.value); }}
              maxLength={7}
              className="w-28 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-nova-red/50" />
            {/* Presets */}
            <div className="flex gap-1.5">
              {["#F97316", "#2563EB", "#16A34A", "#7C3AED", "#DB2777", "#0D1117"].map((c) => (
                <button key={c} onClick={() => set("ctaBg", c)}
                  className="w-6 h-6 rounded-full border-2 border-white/10 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </Field>

        {/* Aperçu */}
        <div className="mt-2 rounded-xl overflow-hidden">
          <div className="p-6 text-center" style={{ background: `linear-gradient(135deg, ${config.ctaBg}, ${config.ctaBg}cc)` }}>
            <p className="text-white font-black text-lg mb-1">{config.ctaTitle || "Titre CTA"}</p>
            <p className="text-white/70 text-xs mb-4">{config.ctaSubtitle || "Sous-titre..."}</p>
            <div className="flex justify-center gap-3">
              {config.ctaBtn1Text && (
                <span className="px-5 py-2 bg-white text-gray-900 rounded-full text-xs font-bold">{config.ctaBtn1Text}</span>
              )}
              {config.ctaBtn2Text && (
                <span className="px-5 py-2 bg-white/15 border border-white/30 text-white rounded-full text-xs font-bold">{config.ctaBtn2Text}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <LinkIcon size={15} className="text-white/40" /> Boutons
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Bouton principal (blanc)</p>
            <div className="space-y-2">
              <TextInput value={config.ctaBtn1Text} onChange={(v) => set("ctaBtn1Text", v)} placeholder="Publier une annonce" />
              <TextInput value={config.ctaBtn1Link} onChange={(v) => set("ctaBtn1Link", v)} placeholder="/publier" />
            </div>
          </div>
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Bouton secondaire (outline)</p>
            <div className="space-y-2">
              <TextInput value={config.ctaBtn2Text} onChange={(v) => set("ctaBtn2Text", v)} placeholder="Nous contacter" />
              <TextInput value={config.ctaBtn2Link} onChange={(v) => set("ctaBtn2Link", v)} placeholder="/contact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Content Tab (Stats, Benefits, Categories) ──────────────────────────────────

function ContentTab({ config, set }: { config: HomepageConfig; set: (k: keyof HomepageConfig, v: any) => void }) {
  const [stats, setStats] = useState(config.stats || []);
  const [whyNova, setWhyNova] = useState(config.whyNova || []);
  const [categories, setCategories] = useState(config.categories || []);

  const updateStats = (s: typeof stats) => { setStats(s); set("stats", s); };
  const updateWhyNova = (w: typeof whyNova) => { setWhyNova(w); set("whyNova", w); };
  const updateCategories = (c: typeof categories) => { setCategories(c); set("categories", c); };

  return (
    <div className="space-y-6">
      {/* Statistiques Section */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Palette size={15} className="text-white/40" /> Section Statistiques
        </h2>
        <Field label="Pill / Label">
          <TextInput value={config.statsLabel} onChange={v => set("statsLabel", v)} placeholder="NOVA en chiffres" />
        </Field>
        <Field label="Titre principal">
          <TextInput value={config.statsTitle} onChange={v => set("statsTitle", v)} placeholder="La confiance, ça se mesure" />
        </Field>
        <Field label="Sous-titre">
          <TextArea value={config.statsSubtitle} onChange={v => set("statsSubtitle", v)} placeholder="Description sous le titre..." />
        </Field>

        <div className="mt-4 space-y-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Compteurs (6 maximum)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/55 text-xs font-bold uppercase">Compteur {i+1}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Icône Lucide</label>
                    <TextInput value={s.icon} onChange={v => { const next = [...stats]; next[i] = { ...next[i], icon: v }; updateStats(next); }} placeholder="Car, Home, Users..." />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Valeur</label>
                    <input type="number" value={s.value} onChange={e => { const next = [...stats]; next[i] = { ...next[i], value: Number(e.target.value) }; updateStats(next); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Suffixe</label>
                    <TextInput value={s.suffix} onChange={v => { const next = [...stats]; next[i] = { ...next[i], suffix: v }; updateStats(next); }} placeholder="+ ou /5..." />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Libellé</label>
                    <TextInput value={s.label} onChange={v => { const next = [...stats]; next[i] = { ...next[i], label: v }; updateStats(next); }} placeholder="Voitures..." />
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Sous-texte</label>
                  <TextInput value={s.sub} onChange={v => { const next = [...stats]; next[i] = { ...next[i], sub: v }; updateStats(next); }} placeholder="Toutes marques..." />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pourquoi Choisir NOVA Section */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Palette size={15} className="text-white/40" /> Section Pourquoi NOVA
        </h2>
        <Field label="Pill / Label">
          <TextInput value={config.whyNovaLabel} onChange={v => set("whyNovaLabel", v)} placeholder="Pourquoi NOVA ?" />
        </Field>
        <Field label="Titre principal">
          <TextInput value={config.whyNovaTitle} onChange={v => set("whyNovaTitle", v)} placeholder="La plateforme qui vous fait confiance" />
        </Field>
        <Field label="Sous-titre">
          <TextArea value={config.whyNovaSubtitle} onChange={v => set("whyNovaSubtitle", v)} placeholder="Description..." />
        </Field>

        <div className="mt-4 space-y-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Cartes d'avantages (6 maximum)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyNova.map((item, i) => (
              <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/55 text-xs font-bold uppercase">Avantage {i+1}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Icône Lucide</label>
                    <TextInput value={item.icon} onChange={v => { const next = [...whyNova]; next[i] = { ...next[i], icon: v }; updateWhyNova(next); }} placeholder="ShieldCheck, Headphones..." />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Titre</label>
                    <TextInput value={item.title} onChange={v => { const next = [...whyNova]; next[i] = { ...next[i], title: v }; updateWhyNova(next); }} placeholder="Transactions sécurisées..." />
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Description</label>
                  <TextArea value={item.description} onChange={v => { const next = [...whyNova]; next[i] = { ...next[i], description: v }; updateWhyNova(next); }} rows={2} placeholder="Description longue..." />
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Badge d'accroche</label>
                  <TextInput value={item.chip.label} onChange={v => { const next = [...whyNova]; next[i] = { ...next[i], chip: { ...next[i].chip, label: v } }; updateWhyNova(next); }} placeholder="Sécurisé..." />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catégories Section */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Palette size={15} className="text-white/40" /> Section Catégories
        </h2>
        <Field label="Pill / Label">
          <TextInput value={config.categoriesLabel} onChange={v => set("categoriesLabel", v)} placeholder="Catégories" />
        </Field>
        <Field label="Titre principal">
          <TextInput value={config.categoriesTitle} onChange={v => set("categoriesTitle", v)} placeholder="Que recherchez-vous ?" />
        </Field>
        <Field label="Sous-titre">
          <TextArea value={config.categoriesSubtitle} onChange={v => set("categoriesSubtitle", v)} placeholder="Description..." />
        </Field>

        <div className="mt-4 space-y-4">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Boutons catégories (5 maximum)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/55 text-xs font-bold uppercase">Bouton {i+1}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Icône Lucide</label>
                    <TextInput value={cat.icon} onChange={v => { const next = [...categories]; next[i] = { ...next[i], icon: v }; updateCategories(next); }} placeholder="CarFront, Key, Home..." />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Titre</label>
                    <TextInput value={cat.label} onChange={v => { const next = [...categories]; next[i] = { ...next[i], label: v }; updateCategories(next); }} placeholder="Acheter une voiture..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Description</label>
                    <TextInput value={cat.description} onChange={v => { const next = [...categories]; next[i] = { ...next[i], description: v }; updateCategories(next); }} placeholder="Neuves et occasions..." />
                  </div>
                  <div>
                    <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Badge</label>
                    <TextInput value={cat.badge} onChange={v => { const next = [...categories]; next[i] = { ...next[i], badge: v }; updateCategories(next); }} placeholder="1 200+ offres..." />
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-[9px] font-medium uppercase tracking-wider block mb-1">Lien de redirection</label>
                  <TextInput value={cat.href} onChange={v => { const next = [...categories]; next[i] = { ...next[i], href: v }; updateCategories(next); }} placeholder="/automobile/vente..." />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Annonces vedettes */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Type size={15} className="text-white/40" /> Section Annonces vedettes
        </h2>
        <Field label="Pill / Label"><TextInput value={config.featuredLabel} onChange={v => set("featuredLabel", v)} placeholder="Annonces vedettes" /></Field>
        <Field label="Titre principal"><TextInput value={config.featuredTitle} onChange={v => set("featuredTitle", v)} placeholder="Nos meilleures offres" /></Field>
        <Field label="Sous-titre"><TextArea value={config.featuredSubtitle} onChange={v => set("featuredSubtitle", v)} placeholder="Sélection premium..." /></Field>
      </div>

      {/* Section Blog */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Type size={15} className="text-white/40" /> Section Blog &amp; Conseils
        </h2>
        <Field label="Pill / Label"><TextInput value={config.blogLabel} onChange={v => set("blogLabel", v)} placeholder="Blog & Conseils" /></Field>
        <Field label="Titre principal"><TextInput value={config.blogTitle} onChange={v => set("blogTitle", v)} placeholder="Nos derniers articles" /></Field>
        <Field label="Sous-titre"><TextArea value={config.blogSubtitle} onChange={v => set("blogSubtitle", v)} placeholder="Conseils d'experts..." /></Field>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HomepagePage() {
  const [config, setConfig] = useState<HomepageConfig>(HOMEPAGE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("hero");

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => {
        let slides = HOMEPAGE_DEFAULTS.heroSlides;
        try { slides = JSON.parse(data.heroSlides || "[]"); if (!slides.length) slides = HOMEPAGE_DEFAULTS.heroSlides; } catch {}
        let order = HOMEPAGE_DEFAULTS.sectionsOrder;
        try { order = JSON.parse(data.sectionsOrder || "[]"); if (!order.length) order = HOMEPAGE_DEFAULTS.sectionsOrder; } catch {}
        setConfig({
          ...HOMEPAGE_DEFAULTS,
          ...data,
          heroSlides: slides,
          sectionsOrder: order,
          sectionStats: data.sectionStats !== "false",
          sectionCategories: data.sectionCategories !== "false",
          sectionOffers: data.sectionOffers !== "false",
          sectionWhyNova: data.sectionWhyNova !== "false",
          sectionBlog: data.sectionBlog !== "false",
          sectionCta: data.sectionCta !== "false",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const set = useCallback((key: keyof HomepageConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, string> = {
        heroType: config.heroType,
        heroTitle: config.heroTitle,
        heroSubtitle: config.heroSubtitle,
        heroBadge: config.heroBadge,
        heroCta1Text: config.heroCta1Text,
        heroCta1Link: config.heroCta1Link,
        heroCta2Text: config.heroCta2Text,
        heroCta2Link: config.heroCta2Link,
        heroOverlay: String(config.heroOverlay),
        heroVideoUrl: config.heroVideoUrl,
        heroSlides: JSON.stringify(config.heroSlides),
        sectionStats: String(config.sectionStats),
        sectionCategories: String(config.sectionCategories),
        sectionOffers: String(config.sectionOffers),
        sectionWhyNova: String(config.sectionWhyNova),
        sectionBlog: String(config.sectionBlog),
        sectionCta: String(config.sectionCta),
        sectionsOrder: JSON.stringify(config.sectionsOrder),
        ctaTitle: config.ctaTitle,
        ctaSubtitle: config.ctaSubtitle,
        ctaBg: config.ctaBg,
        ctaBtn1Text: config.ctaBtn1Text,
        ctaBtn1Link: config.ctaBtn1Link,
        ctaBtn2Text: config.ctaBtn2Text,
        ctaBtn2Link: config.ctaBtn2Link,
        showHeroCard: String(config.showHeroCard !== false),
        heroCardBadge: config.heroCardBadge,
        heroCardPrice: config.heroCardPrice,
        heroCardTitle: config.heroCardTitle,
        heroCardSpecs: JSON.stringify(config.heroCardSpecs || []),
        heroCardLocation: config.heroCardLocation,
        heroCardLink: config.heroCardLink,
        heroStats: JSON.stringify(config.heroStats || []),
        heroActivity: JSON.stringify(config.heroActivity || []),
        heroPopularBadge: config.heroPopularBadge,
        heroTrustBadges: JSON.stringify(config.heroTrustBadges || []),
        statsLabel: config.statsLabel,
        whyNovaLabel: config.whyNovaLabel,
        categoriesLabel: config.categoriesLabel,
        ctaLabel: config.ctaLabel,
        featuredLabel: config.featuredLabel,
        featuredTitle: config.featuredTitle,
        featuredSubtitle: config.featuredSubtitle,
        blogLabel: config.blogLabel,
        blogTitle: config.blogTitle,
        blogSubtitle: config.blogSubtitle,
      };
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-white/20" size={28} />
      </div>
    );
  }

  const TABS: { id: Tab; label: string; Icon: any }[] = [
    { id: "hero",     label: "Hero",     Icon: Film },
    { id: "sections", label: "Sections", Icon: LayoutTemplate },
    { id: "cta",      label: "CTA",      Icon: Megaphone },
    { id: "content",  label: "Contenus", Icon: Type },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Home size={20} className="text-nova-red" /> Page d'Accueil
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Contrôlez 100% du contenu et de la mise en page de la page d'accueil
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">
            <ExternalLink size={13} /> Voir le site
          </a>
          <button onClick={() => setConfig(HOMEPAGE_DEFAULTS)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">
            <RefreshCw size={13} /> Réinitialiser
          </button>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 ${
              saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-nova-red hover:opacity-90 text-white"
            }`}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? "Enregistrement…" : saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <Check size={15} /> Page d'accueil mise à jour — changements visibles sur le site
          </p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 underline">Voir →</a>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "hero"     && <HeroTab     config={config} set={set} />}
      {tab === "sections" && <SectionsTab config={config} set={set} />}
      {tab === "cta"      && <CtaTab      config={config} set={set} />}
      {tab === "content"  && <ContentTab  config={config} set={set} />}
    </div>
  );
}
