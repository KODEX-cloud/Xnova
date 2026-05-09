"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Palette, Save, Loader2, Check, RefreshCw, Eye,
  Type, Sliders, MousePointer, Grid3x3,
  Navigation, Sun, Moon, Monitor, Zap, AlertCircle,
} from "lucide-react";
import { getContrastColor, isLightColor } from "@/lib/utils/contrast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DesignSettings {
  // Brand
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  // Text & Bg
  colorText: string;
  colorBg: string;
  colorHeading: string;
  colorSectionAlt: string;
  // Buttons
  colorButton: string;
  colorButtonText: string;
  colorButtonHover: string;
  // Cards
  colorCard: string;
  colorCardBorder: string;
  // Navigation
  colorNavBg: string;
  colorNavText: string;
  colorNavHover: string;
  // Shape & font
  borderRadius: string;
  fontFamily: string;
  shadowStrength: string;
  // Dark mode & animations
  defaultTheme: string;
  animationsEnabled: string;
}

const DEFAULTS: DesignSettings = {
  colorPrimary:    "#F97316",
  colorSecondary:  "#FB923C",
  colorAccent:     "#FBBF24",
  colorText:       "#1F2937",
  colorBg:         "#FFFFFF",
  colorHeading:    "#111827",
  colorSectionAlt: "#F9FAFB",
  colorButton:     "#F97316",
  colorButtonText: "#FFFFFF",
  colorButtonHover:"#FB923C",
  colorCard:       "#FFFFFF",
  colorCardBorder: "#E5E7EB",
  colorNavBg:      "#FFFFFF",
  colorNavText:    "#1F2937",
  colorNavHover:   "#F97316",
  borderRadius:    "12px",
  fontFamily:      "'Inter', sans-serif",
  shadowStrength:  "medium",
  defaultTheme:    "light",
  animationsEnabled: "true",
};

// ── Preset palettes ────────────────────────────────────────────────────────────

const PRESETS = [
  {
    name: "NOVA Orange",
    primary: "#F97316", secondary: "#FB923C", accent: "#FBBF24",
    btn: "#F97316", navHover: "#F97316",
  },
  {
    name: "Bleu Océan",
    primary: "#2563EB", secondary: "#3B82F6", accent: "#06B6D4",
    btn: "#2563EB", navHover: "#2563EB",
  },
  {
    name: "Vert Nature",
    primary: "#16A34A", secondary: "#22C55E", accent: "#84CC16",
    btn: "#16A34A", navHover: "#16A34A",
  },
  {
    name: "Violet Premium",
    primary: "#7C3AED", secondary: "#8B5CF6", accent: "#A78BFA",
    btn: "#7C3AED", navHover: "#7C3AED",
  },
  {
    name: "Rose Élégant",
    primary: "#DB2777", secondary: "#EC4899", accent: "#F43F5E",
    btn: "#DB2777", navHover: "#DB2777",
  },
  {
    name: "Gris Minimal",
    primary: "#374151", secondary: "#6B7280", accent: "#9CA3AF",
    btn: "#374151", navHover: "#374151",
  },
];

const FONT_OPTIONS = [
  { label: "Inter (défaut)", value: "'Inter', sans-serif" },
  { label: "Poppins",        value: "'Poppins', sans-serif" },
  { label: "Montserrat",     value: "'Montserrat', sans-serif" },
  { label: "Roboto",         value: "'Roboto', sans-serif" },
  { label: "Playfair Display (serif)", value: "'Playfair Display', serif" },
  { label: "Raleway",        value: "'Raleway', sans-serif" },
];

const RADIUS_OPTIONS = [
  { label: "Carré",   value: "0px" },
  { label: "4 px",    value: "4px" },
  { label: "8 px",    value: "8px" },
  { label: "12 px",   value: "12px" },
  { label: "16 px",   value: "16px" },
  { label: "24 px",   value: "24px" },
  { label: "Pill",    value: "9999px" },
];

const SHADOW_OPTIONS = [
  { label: "Aucune",  value: "none" },
  { label: "Légère",  value: "light" },
  { label: "Moyenne", value: "medium" },
  { label: "Forte",   value: "heavy" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
      <Icon size={15} className="text-white/40" /> {title}
    </h2>
  );
}

function ColorField({
  label, description, value, onChange, showContrast = false,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  showContrast?: boolean;
}) {
  const contrast = getContrastColor(value);
  const light = isLightColor(value);

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-white/30 text-xs mt-0.5">{description}</p>}
        {showContrast && (
          <span
            className="inline-flex items-center gap-1 text-[10px] mt-1 px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: value, color: contrast }}
          >
            {light ? "Fond clair → texte foncé" : "Fond sombre → texte clair"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer overflow-hidden relative"
          style={{ backgroundColor: value }}
          title="Cliquer pour choisir une couleur"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#([0-9A-Fa-f]{0,6})$/.test(v)) onChange(v);
          }}
          maxLength={7}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-nova-red/50"
        />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DesignPage() {
  const [settings, setSettings] = useState<DesignSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const liveStyleRef = useRef<HTMLStyleElement | null>(null);

  // ── Load from API ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/design")
      .then((r) => r.json())
      .then((data) => {
        setSettings({ ...DEFAULTS, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Real-time CSS injection ─────────────────────────────────────────────────
  // Updates CSS variables on the current page as the admin changes settings.
  // Scoped to the preview iframe — does NOT change the admin shell's dark theme.
  useEffect(() => {
    if (!liveStyleRef.current) {
      const el = document.createElement("style");
      el.id = "nova-live-design";
      document.head.appendChild(el);
      liveStyleRef.current = el;
    }
    const s = settings;
    const btn = s.colorButton || s.colorPrimary;
    const btnText = s.colorButtonText || getContrastColor(btn);

    liveStyleRef.current.textContent = `
      :root {
        --nova-primary:      ${s.colorPrimary};
        --nova-secondary:    ${s.colorSecondary};
        --nova-accent:       ${s.colorAccent};
        --nova-text:         ${s.colorText};
        --nova-heading:      ${s.colorHeading};
        --nova-bg:           ${s.colorBg};
        --nova-section-alt:  ${s.colorSectionAlt};
        --nova-btn:          ${btn};
        --nova-btn-text:     ${btnText};
        --nova-btn-hover:    ${s.colorButtonHover || s.colorSecondary};
        --nova-card:         ${s.colorCard || s.colorBg};
        --nova-card-border:  ${s.colorCardBorder};
        --nova-nav-bg:       ${s.colorNavBg};
        --nova-nav-text:     ${s.colorNavText};
        --nova-nav-hover:    ${s.colorNavHover};
        --nova-radius:       ${s.borderRadius};
        --nova-font:         ${s.fontFamily};
      }
    `;
    return () => {};
  }, [settings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { liveStyleRef.current?.remove(); };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = (key: keyof DesignSettings) => (value: string) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const btnText = getContrastColor(preset.btn);
    setSettings((s) => ({
      ...s,
      colorPrimary:    preset.primary,
      colorSecondary:  preset.secondary,
      colorAccent:     preset.accent,
      colorButton:     preset.btn,
      colorButtonText: btnText,
      colorButtonHover:preset.secondary,
      colorNavHover:   preset.navHover,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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

  const handleReset = () => setSettings(DEFAULTS);

  // Auto-fill button text when button bg changes
  const handleButtonBgChange = (v: string) => {
    setSettings((s) => ({
      ...s,
      colorButton: v,
      colorButtonText: getContrastColor(v),
    }));
  };

  // Auto-fill nav text when nav bg changes
  const handleNavBgChange = (v: string) => {
    setSettings((s) => ({
      ...s,
      colorNavBg: v,
      colorNavText: getContrastColor(v),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-white/20" size={28} />
      </div>
    );
  }

  const previewBtn = settings.colorButton || settings.colorPrimary;
  const previewBtnText = settings.colorButtonText || getContrastColor(previewBtn);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Palette size={20} className="text-nova-red" /> Design & Thème Global
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Contrôlez 100% de l'apparence du site sans toucher au code
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
          >
            <RefreshCw size={13} /> Réinitialiser
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
          >
            <Eye size={13} /> Voir le site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              saved
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-nova-red hover:opacity-90 text-white"
            } disabled:opacity-50`}
          >
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
            <Check size={15} /> Thème enregistré — les changements sont visibles sur le site
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 underline hover:text-green-300"
          >
            Voir le site →
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left / center: settings ──────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* 1. Preset palettes */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Palette} title="Palettes prédéfinies" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group"
                >
                  <div className="flex gap-1 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full ring-1 ring-white/10" style={{ backgroundColor: preset.primary }} />
                    <div className="w-4 h-4 rounded-full ring-1 ring-white/10" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-4 h-4 rounded-full ring-1 ring-white/10" style={{ backgroundColor: preset.accent }} />
                  </div>
                  <span className="text-white/50 text-xs group-hover:text-white/80 transition-colors leading-tight">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Brand colors */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Palette} title="🎨 Couleurs de marque" />
            <ColorField label="Couleur principale" description="Boutons CTA, liens actifs, icônes" value={settings.colorPrimary} onChange={set("colorPrimary")} showContrast />
            <ColorField label="Couleur secondaire" description="Dégradés, states hover" value={settings.colorSecondary} onChange={set("colorSecondary")} showContrast />
            <ColorField label="Couleur d'accentuation" description="Étoiles, badges, highlights" value={settings.colorAccent} onChange={set("colorAccent")} showContrast />
          </div>

          {/* 3. Text & backgrounds */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Sun} title="🌐 Fond & Textes globaux" />
            <ColorField label="Fond général du site" description="Background de toutes les pages" value={settings.colorBg} onChange={set("colorBg")} showContrast />
            <ColorField label="Fond alterné (sections grises)" description="bg-gray-50 — sections alternées" value={settings.colorSectionAlt} onChange={set("colorSectionAlt")} showContrast />
            <ColorField label="Couleur du texte principal" description="Corps de texte, paragraphes" value={settings.colorText} onChange={set("colorText")} />
            <ColorField label="Couleur des titres (H1-H6)" description="Tous les titres du site" value={settings.colorHeading} onChange={set("colorHeading")} />
          </div>

          {/* 4. Buttons */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={MousePointer} title="🔘 Boutons" />
            <div className="mb-3 p-3 bg-white/[0.03] rounded-lg">
              <p className="text-white/30 text-xs mb-2">Aperçu bouton :</p>
              <div className="flex gap-2">
                <span
                  className="px-4 py-2 text-sm font-bold"
                  style={{
                    backgroundColor: previewBtn,
                    color: previewBtnText,
                    borderRadius: settings.borderRadius,
                  }}
                >
                  Explorer →
                </span>
                <span
                  className="px-4 py-2 text-sm font-bold border-2"
                  style={{
                    borderColor: `${previewBtn}60`,
                    color: previewBtn,
                    borderRadius: settings.borderRadius,
                    backgroundColor: "transparent",
                  }}
                >
                  En savoir plus
                </span>
              </div>
            </div>
            <ColorField
              label="Fond du bouton principal"
              description="Couleur de fond des boutons CTA"
              value={settings.colorButton}
              onChange={handleButtonBgChange}
              showContrast
            />
            <ColorField
              label="Texte du bouton"
              description="Calculé automatiquement — peut être surchargé"
              value={settings.colorButtonText}
              onChange={set("colorButtonText")}
            />
            <ColorField
              label="Couleur au survol (hover)"
              description="Background quand la souris est sur le bouton"
              value={settings.colorButtonHover}
              onChange={set("colorButtonHover")}
              showContrast
            />
          </div>

          {/* 5. Cards & borders */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Grid3x3} title="📦 Cartes & Cadres" />
            <div className="mb-3 p-3 bg-white/[0.03] rounded-lg">
              <div
                className="p-4 max-w-[180px]"
                style={{
                  backgroundColor: settings.colorCard,
                  border: `1px solid ${settings.colorCardBorder}`,
                  borderRadius: settings.borderRadius,
                  boxShadow: {
                    none: "none", light: "0 2px 8px rgba(0,0,0,0.06)",
                    medium: "0 4px 20px rgba(0,0,0,0.10)", heavy: "0 8px 40px rgba(0,0,0,0.18)",
                  }[settings.shadowStrength] || "0 4px 20px rgba(0,0,0,0.10)",
                }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: settings.colorHeading }}>Carte exemple</p>
                <p className="text-[10px]" style={{ color: settings.colorText }}>Contenu de la carte</p>
                <p className="text-[10px] font-black mt-1" style={{ color: settings.colorPrimary }}>15 000 000 FCFA</p>
              </div>
            </div>
            <ColorField label="Fond des cartes" value={settings.colorCard} onChange={set("colorCard")} showContrast />
            <ColorField label="Bordure des cartes" value={settings.colorCardBorder} onChange={set("colorCardBorder")} />
            {/* Shadow */}
            <div className="pt-3">
              <p className="text-white text-sm font-medium mb-2">Intensité de l'ombre</p>
              <div className="grid grid-cols-4 gap-2">
                {SHADOW_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => set("shadowStrength")(o.value)}
                    className={`py-2 px-3 text-xs rounded-lg border transition-all ${
                      settings.shadowStrength === o.value
                        ? "border-nova-red/50 bg-nova-red/10 text-nova-red"
                        : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/15"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Navigation */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Navigation} title="📑 Menu & Navigation" />
            <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: settings.colorNavBg, border: "1px solid rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm" style={{ color: settings.colorPrimary }}>NOVA</span>
                <div className="flex items-center gap-3">
                  {["Accueil", "Auto", "Immo"].map((item, i) => (
                    <span
                      key={item}
                      className="text-xs font-medium"
                      style={{ color: i === 0 ? settings.colorNavHover : settings.colorNavText }}
                    >
                      {item}
                    </span>
                  ))}
                  <span
                    className="text-xs font-bold px-3 py-1"
                    style={{ backgroundColor: previewBtn, color: previewBtnText, borderRadius: settings.borderRadius }}
                  >
                    Contact
                  </span>
                </div>
              </div>
            </div>
            <ColorField
              label="Fond du menu"
              description="Background de la barre de navigation"
              value={settings.colorNavBg}
              onChange={handleNavBgChange}
              showContrast
            />
            <ColorField
              label="Texte du menu"
              description="Liens de navigation"
              value={settings.colorNavText}
              onChange={set("colorNavText")}
            />
            <ColorField
              label="Couleur au survol / actif"
              description="Lien actif ou au hover dans le menu"
              value={settings.colorNavHover}
              onChange={set("colorNavHover")}
              showContrast
            />
          </div>

          {/* 7. Typography */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Type} title="✍️ Typographie" />
            <div className="mb-4">
              <label className="text-white/50 text-xs font-medium block mb-2">Police de caractères</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => set("fontFamily")(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value} className="bg-[#111827]">{f.label}</option>
                ))}
              </select>
              <div className="mt-2 p-3 bg-white/[0.02] rounded-lg">
                <p className="text-white/20 text-xs mb-1">Prévisualisation :</p>
                <p style={{ fontFamily: settings.fontFamily }} className="text-white/80 text-sm font-medium">
                  NOVA Automobile & Immobilier CI
                </p>
                <p style={{ fontFamily: settings.fontFamily }} className="text-white/40 text-xs mt-0.5">
                  Votre partenaire premium en Côte d'Ivoire
                </p>
              </div>
            </div>
          </div>

          {/* 8. Border radius */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Sliders} title="📐 Arrondi des éléments" />
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => set("borderRadius")(r.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                    settings.borderRadius === r.value
                      ? "border-nova-red/50 bg-nova-red/10 text-nova-red"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70"
                  }`}
                >
                  <div
                    className="w-8 h-8 border-2 border-current"
                    style={{ borderRadius: r.value === "9999px" ? "9999px" : r.value }}
                  />
                  <span className="text-[10px] text-center leading-tight">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* 9. Dark Mode */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Moon} title="🌙 Mode Sombre" />
            <p className="text-white/30 text-xs mb-4">
              Définit le thème par défaut pour les visiteurs. Chaque utilisateur peut ensuite choisir son préférence via le bouton dans la navbar.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light",  label: "Clair",   Icon: Sun,     desc: "Fond blanc" },
                { value: "dark",   label: "Sombre",  Icon: Moon,    desc: "Fond noir" },
                { value: "system", label: "Système", Icon: Monitor, desc: "Selon l'OS" },
              ].map(({ value, label, Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => set("defaultTheme")(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    settings.defaultTheme === value
                      ? "border-nova-red/50 bg-nova-red/10 text-nova-red"
                      : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/70"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px] opacity-60">{desc}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/[0.03] rounded-lg flex items-start gap-2">
              <Monitor size={13} className="text-white/30 mt-0.5 flex-shrink-0" />
              <p className="text-white/30 text-xs">
                Le mode sombre surcharge automatiquement les couleurs de fond, texte, cartes et navigation. Les couleurs de marque (primaire, secondaire) restent inchangées.
              </p>
            </div>
          </div>

          {/* 10. Animations */}
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <SectionTitle icon={Zap} title="✨ Animations & Transitions" />
            <p className="text-white/30 text-xs mb-4">
              Contrôlez les animations Framer Motion et CSS sur l'ensemble du site. La désactivation améliore les performances et l'accessibilité.
            </p>
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
              <div>
                <p className="text-white text-sm font-medium">Animations activées</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {settings.animationsEnabled !== "false"
                    ? "Les transitions et animations Framer Motion sont actives"
                    : "Toutes les animations sont désactivées — transitions instantanées"}
                </p>
              </div>
              <button
                onClick={() => set("animationsEnabled")(settings.animationsEnabled === "false" ? "true" : "false")}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                  settings.animationsEnabled !== "false" ? "bg-nova-red" : "bg-white/10"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.animationsEnabled !== "false" ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <p className="text-white/50 text-xs font-medium mb-1">Avec animations</p>
                <div className="space-y-1">
                  <div className="h-2 bg-gradient-to-r from-nova-red to-nova-orange rounded-full animate-pulse" />
                  <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                </div>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <p className="text-white/50 text-xs font-medium mb-1">Sans animations</p>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: live preview ───────────────────────────────────────────── */}
        <div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 sticky top-6">
            <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Eye size={15} className="text-white/40" /> Aperçu en direct
            </h2>

            <div className="rounded-xl overflow-hidden border border-white/10 text-sm">
              {/* Navbar preview */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: settings.colorNavBg }}
              >
                <span className="font-black text-sm" style={{ color: settings.colorPrimary }}>NOVA</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: settings.colorNavText }}>Auto</span>
                  <span className="text-xs" style={{ color: settings.colorNavHover }}>Immo ▾</span>
                  <span
                    className="px-3 py-1 text-xs font-bold"
                    style={{ background: `linear-gradient(135deg,${settings.colorPrimary},${settings.colorSecondary})`, color: previewBtnText, borderRadius: settings.borderRadius }}
                  >
                    Contact
                  </span>
                </div>
              </div>

              {/* Hero preview */}
              <div
                className="px-4 py-6"
                style={{ background: `linear-gradient(135deg,${settings.colorBg},${settings.colorPrimary}15)`, fontFamily: settings.fontFamily }}
              >
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold mb-3 rounded-full"
                  style={{ backgroundColor: `${settings.colorPrimary}18`, color: settings.colorPrimary }}
                >
                  ✦ Marketplace #1
                </div>
                <p className="font-black text-base mb-0.5" style={{ color: settings.colorHeading }}>Votre Partenaire</p>
                <p
                  className="font-black text-xl mb-3"
                  style={{
                    background: `linear-gradient(135deg,${settings.colorPrimary},${settings.colorSecondary},${settings.colorAccent})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Premium CI
                </p>
                <p className="text-xs mb-4" style={{ color: `${settings.colorText}99` }}>
                  Les meilleures voitures à Abidjan.
                </p>
                <div className="flex gap-2">
                  <span
                    className="px-4 py-2 text-xs font-bold"
                    style={{ background: `linear-gradient(135deg,${previewBtn},${settings.colorButtonHover})`, color: previewBtnText, borderRadius: settings.borderRadius }}
                  >
                    Explorer →
                  </span>
                  <span
                    className="px-4 py-2 text-xs font-bold border-2"
                    style={{ borderColor: `${previewBtn}50`, color: previewBtn, borderRadius: settings.borderRadius, backgroundColor: settings.colorBg }}
                  >
                    Publier
                  </span>
                </div>
              </div>

              {/* Cards preview */}
              <div className="p-3 grid grid-cols-2 gap-2" style={{ backgroundColor: settings.colorSectionAlt }}>
                {[{ label: "BMW X5 2024", price: "28 500 000 FCFA", emoji: "🚗" }, { label: "Villa Cocody", price: "300 000/mois", emoji: "🏠" }].map((item, i) => (
                  <div
                    key={item.label}
                    className="p-3"
                    style={{
                      backgroundColor: settings.colorCard,
                      border: `1px solid ${settings.colorCardBorder}`,
                      borderRadius: settings.borderRadius,
                      boxShadow: { none: "none", light: "0 2px 8px rgba(0,0,0,0.06)", medium: "0 4px 20px rgba(0,0,0,0.10)", heavy: "0 8px 40px rgba(0,0,0,0.18)" }[settings.shadowStrength] || "none",
                    }}
                  >
                    <div
                      className="h-10 flex items-center justify-center text-base mb-2"
                      style={{ backgroundColor: `${i === 0 ? settings.colorPrimary : settings.colorSecondary}15`, borderRadius: `calc(${settings.borderRadius} / 1.5)` }}
                    >
                      {item.emoji}
                    </div>
                    <p className="text-[10px] font-bold truncate" style={{ color: settings.colorHeading }}>{item.label}</p>
                    <p className="text-[10px] font-black" style={{ color: settings.colorPrimary }}>{item.price}</p>
                  </div>
                ))}
              </div>

              {/* Stars / accent */}
              <div className="px-4 py-3 flex items-center gap-1" style={{ backgroundColor: settings.colorBg }}>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: settings.colorAccent }}>{s}</span>
                ))}
                <span className="text-[10px] ml-1" style={{ color: `${settings.colorText}70` }}>4.9 / 5 · 2 400 avis</span>
              </div>
            </div>

            <p className="text-white/20 text-[10px] text-center mt-3">
              Les variables CSS sont injectées en temps réel sur cette page
            </p>

            {/* Contrast report */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <p className="text-white/40 text-xs font-medium">Rapport de contraste :</p>
              {[
                { label: "Fond → Texte",   bg: settings.colorBg,      fg: settings.colorText },
                { label: "Fond → Titres",  bg: settings.colorBg,      fg: settings.colorHeading },
                { label: "Bouton → Texte", bg: previewBtn,            fg: previewBtnText },
                { label: "Menu → Texte",   bg: settings.colorNavBg,   fg: settings.colorNavText },
                { label: "Carte → Texte",  bg: settings.colorCard,    fg: settings.colorText },
              ].map(({ label, bg, fg }) => {
                const r = parseInt(bg.replace("#","").slice(0,2),16);
                const g2 = parseInt(bg.replace("#","").slice(2,4),16);
                const b2 = parseInt(bg.replace("#","").slice(4,6),16);
                const fr = parseInt(fg.replace("#","").slice(0,2),16);
                const fg2 = parseInt(fg.replace("#","").slice(2,4),16);
                const fb = parseInt(fg.replace("#","").slice(4,6),16);
                const L1 = (0.299*r + 0.587*g2 + 0.114*b2)/255;
                const L2 = (0.299*fr + 0.587*fg2 + 0.114*fb)/255;
                const ratio = L1 > L2
                  ? (L1 + 0.05) / (L2 + 0.05)
                  : (L2 + 0.05) / (L1 + 0.05);
                const ok = ratio >= 4.5;
                return (
                  <div key={label} className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40">{label}</span>
                    <span className={`font-bold ${ok ? "text-green-400" : "text-red-400"}`}>
                      {ratio.toFixed(1)}:1 {ok ? "✓" : "⚠"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
