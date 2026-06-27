"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Palette, Save, Loader2, Check, Eye, Sliders, Type,
  MessageCircle, Image as ImageIcon, Layout, Zap, ExternalLink,
} from "lucide-react";

// ── Config interface ──────────────────────────────────────────────────────────

interface UIConfig {
  // Hero
  heroOverlayOpacity:  string;  // 0-90
  heroTitleColor:      string;  // hex
  heroBtnText:         string;
  heroBtnColor:        string;
  heroBtnTextColor:    string;
  // Cards
  cardRadius:          string;  // sm | md | lg | xl | 2xl
  cardShadow:          string;  // none | sm | md | lg | xl
  cardHoverScale:      string;  // true | false
  cardHoverLift:       string;  // true | false
  cardImgOverlay:      string;  // none | light | medium | heavy
  showWhatsappBtn:     string;  // true | false
  showViewBtn:         string;  // true | false
  // Buttons
  btnRadius:           string;  // rounded | pill | square
  btnPrimColor:        string;
  btnPrimText:         string;
  btnWhatsappColor:    string;
  // Global
  accentColor:         string;
  accentColorAlt:      string;
  bodyBg:              string;
  whatsapp:            string;
}

const DEFAULTS: UIConfig = {
  heroOverlayOpacity:  "70",
  heroTitleColor:      "#FFFFFF",
  heroBtnText:         "Voir les annonces",
  heroBtnColor:        "#F97316",
  heroBtnTextColor:    "#FFFFFF",
  cardRadius:          "2xl",
  cardShadow:          "md",
  cardHoverScale:      "true",
  cardHoverLift:       "true",
  cardImgOverlay:      "medium",
  showWhatsappBtn:     "true",
  showViewBtn:         "true",
  btnRadius:           "rounded",
  btnPrimColor:        "#F97316",
  btnPrimText:         "#FFFFFF",
  btnWhatsappColor:    "#25D366",
  accentColor:         "#F97316",
  accentColorAlt:      "#FB923C",
  bodyBg:              "#F9FAFB",
  whatsapp:            "+2250700000000",
};

const TABS = [
  { key: "hero",    label: "Hero",    Icon: Layout },
  { key: "cards",   label: "Cartes",  Icon: ImageIcon },
  { key: "buttons", label: "Boutons", Icon: Zap },
  { key: "global",  label: "Global",  Icon: Palette },
] as const;

type Tab = typeof TABS[number]["key"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-gray-800 text-sm font-semibold">{label}</p>
        {hint && <p className="text-gray-400 text-xs mt-0.5">{hint}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-nova-red" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-mono">
          {value}
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-nova-red/50 transition-all">
        {options.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-gray-700 text-sm font-semibold block mb-1.5">{label}</label>
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-nova-red/50 transition-all" />
    </div>
  );
}

function RangeField({ label, value, min, max, unit, onChange }: { label: string; value: string; min: number; max: number; unit?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-gray-700 text-sm font-semibold">{label}</label>
        <span className="text-nova-red text-sm font-bold">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full accent-nova-red" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UIControlPage() {
  const [cfg,    setCfg]    = useState<UIConfig>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const [tab,    setTab]    = useState<Tab>("hero");

  // Load existing settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        if (data && typeof data === "object") {
          const mapped: Partial<UIConfig> = {};
          for (const key of Object.keys(DEFAULTS) as (keyof UIConfig)[]) {
            if (data[key]) (mapped as any)[key] = data[key];
          }
          setCfg((prev) => ({ ...prev, ...mapped }));
        }
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof UIConfig) => (val: string) => setCfg((prev) => ({ ...prev, [key]: val }));
  const bool = (key: keyof UIConfig) => cfg[key] === "true";

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const body: Record<string, string> = {};
      for (const [k, v] of Object.entries(cfg)) body[k] = String(v);

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

  // Live CSS preview injection
  useEffect(() => {
    const style = document.getElementById("ui-preview-style") || document.createElement("style");
    style.id = "ui-preview-style";
    style.innerHTML = `
      .preview-card { border-radius: ${cfg.cardRadius === "sm" ? "8px" : cfg.cardRadius === "md" ? "12px" : cfg.cardRadius === "lg" ? "16px" : cfg.cardRadius === "xl" ? "20px" : "24px"}; }
    `;
    document.head.appendChild(style);
  }, [cfg.cardRadius]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center shadow-lg shadow-orange-300/30">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">UI Control</h1>
            <p className="text-gray-500 text-sm">Design global & expérience utilisateur</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-all">
            <ExternalLink className="h-4 w-4" /> Prévisualiser
          </a>
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
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            <Icon className="h-4 w-4" /> <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 space-y-6">

        {/* ── HERO ── */}
        {tab === "hero" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100 mb-5">Section Hero (pages listings)</h2>

              <RangeField label="Opacité de l'overlay (%)" value={cfg.heroOverlayOpacity} min={0} max={90} unit="%" onChange={set("heroOverlayOpacity")} />

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <ColorPicker label="Couleur du titre" value={cfg.heroTitleColor} onChange={set("heroTitleColor")} />
                <ColorPicker label="Couleur du bouton CTA" value={cfg.heroBtnColor} onChange={set("heroBtnColor")} />
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <TextField label="Texte du bouton CTA" value={cfg.heroBtnText} placeholder="Voir les annonces" onChange={set("heroBtnText")} />
                <ColorPicker label="Texte du bouton CTA" value={cfg.heroBtnTextColor} onChange={set("heroBtnTextColor")} />
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-2xl overflow-hidden">
              <p className="text-gray-500 text-xs font-medium mb-2">Aperçu hero</p>
              <div className="relative h-40 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #111827, #1F2937)" }}>
                <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${parseInt(cfg.heroOverlayOpacity) / 100})` }} />
                <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                  <h3 className="font-black text-2xl mb-3" style={{ color: cfg.heroTitleColor }}>Biens immobiliers à vendre</h3>
                  <button className="w-fit px-5 py-2 rounded-xl text-sm font-bold" style={{ background: cfg.heroBtnColor, color: cfg.heroBtnTextColor }}>
                    {cfg.heroBtnText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CARDS ── */}
        {tab === "cards" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Style des cartes d'annonces</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Rayon des coins" value={cfg.cardRadius}
                options={[{ v: "sm", l: "Léger (8px)" }, { v: "md", l: "Modéré (12px)" }, { v: "lg", l: "Arrondi (16px)" }, { v: "xl", l: "Très arrondi (20px)" }, { v: "2xl", l: "Maximum (24px)" }]}
                onChange={set("cardRadius")} />
              <SelectField label="Ombre" value={cfg.cardShadow}
                options={[{ v: "none", l: "Aucune" }, { v: "sm", l: "Légère" }, { v: "md", l: "Normale" }, { v: "lg", l: "Prononcée" }, { v: "xl", l: "Forte" }]}
                onChange={set("cardShadow")} />
              <SelectField label="Intensité overlay image" value={cfg.cardImgOverlay}
                options={[{ v: "none", l: "Aucun" }, { v: "light", l: "Léger" }, { v: "medium", l: "Moyen (recommandé)" }, { v: "heavy", l: "Fort" }]}
                onChange={set("cardImgOverlay")} />
            </div>

            <div className="border border-gray-100 rounded-2xl p-4 space-y-1">
              <Toggle label="Zoom image au survol" value={bool("cardHoverScale")} onChange={(v) => set("cardHoverScale")(String(v))} />
              <Toggle label="Élévation carte au survol" hint="La carte se lève légèrement" value={bool("cardHoverLift")} onChange={(v) => set("cardHoverLift")(String(v))} />
              <Toggle label="Bouton WhatsApp visible" hint="Afficher le bouton de contact WhatsApp" value={bool("showWhatsappBtn")} onChange={(v) => set("showWhatsappBtn")(String(v))} />
              <Toggle label="Bouton Voir détails visible" value={bool("showViewBtn")} onChange={(v) => set("showViewBtn")(String(v))} />
            </div>

            {/* Card preview */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2">Aperçu carte</p>
              <div className={`w-56 bg-white overflow-hidden border border-gray-100 preview-card ${
                cfg.cardShadow === "sm" ? "shadow-sm" : cfg.cardShadow === "md" ? "shadow-md" : cfg.cardShadow === "lg" ? "shadow-lg" : cfg.cardShadow === "xl" ? "shadow-xl" : ""
              }`} style={{ borderRadius: cfg.cardRadius === "sm" ? "8px" : cfg.cardRadius === "md" ? "12px" : cfg.cardRadius === "lg" ? "16px" : cfg.cardRadius === "xl" ? "20px" : "24px" }}>
                <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0" style={{ background: cfg.cardImgOverlay === "none" ? "none" : cfg.cardImgOverlay === "light" ? "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" : cfg.cardImgOverlay === "medium" ? "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1), transparent)" : "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)" }} />
                  <div className="absolute bottom-2 left-2 text-white font-black text-sm drop-shadow">95 000 000 CFA</div>
                </div>
                <div className="p-3">
                  <p className="text-gray-800 font-bold text-xs mb-3">Maison 4 Chambres à Cocody</p>
                  {(bool("showViewBtn") || bool("showWhatsappBtn")) && (
                    <div className="flex gap-1.5">
                      {bool("showViewBtn") && (
                        <div className="flex-1 text-center py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600">Voir</div>
                      )}
                      {bool("showWhatsappBtn") && (
                        <div className="px-2 py-1.5 text-xs font-bold rounded-lg text-white" style={{ background: cfg.btnWhatsappColor }}>WA</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BUTTONS ── */}
        {tab === "buttons" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Style des boutons</h2>

            <SelectField label="Style de coins" value={cfg.btnRadius}
              options={[{ v: "square", l: "Carré (4px)" }, { v: "rounded", l: "Arrondi (12px)" }, { v: "pill", l: "Pilule (9999px)" }]}
              onChange={set("btnRadius")} />

            <div className="grid sm:grid-cols-2 gap-4">
              <ColorPicker label="Couleur principale" value={cfg.btnPrimColor} onChange={set("btnPrimColor")} />
              <ColorPicker label="Texte principal" value={cfg.btnPrimText} onChange={set("btnPrimText")} />
              <ColorPicker label="Couleur WhatsApp" value={cfg.btnWhatsappColor} onChange={set("btnWhatsappColor")} />
            </div>

            {/* Button previews */}
            <div>
              <p className="text-gray-500 text-xs font-medium mb-3">Aperçu boutons</p>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 text-sm font-bold"
                  style={{ background: cfg.btnPrimColor, color: cfg.btnPrimText, borderRadius: cfg.btnRadius === "square" ? "4px" : cfg.btnRadius === "pill" ? "9999px" : "12px" }}>
                  Voir la fiche →
                </button>
                <button className="px-5 py-2.5 text-sm font-bold"
                  style={{ background: cfg.btnWhatsappColor, color: "#FFFFFF", borderRadius: cfg.btnRadius === "square" ? "4px" : cfg.btnRadius === "pill" ? "9999px" : "12px" }}>
                  💬 WhatsApp
                </button>
                <button className="px-5 py-2.5 text-sm font-bold border"
                  style={{ borderColor: cfg.btnPrimColor, color: cfg.btnPrimColor, background: "transparent", borderRadius: cfg.btnRadius === "square" ? "4px" : cfg.btnRadius === "pill" ? "9999px" : "12px" }}>
                  En savoir plus
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── GLOBAL ── */}
        {tab === "global" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-gray-900 font-bold text-base pb-3 border-b border-gray-100">Paramètres globaux</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <ColorPicker label="Couleur d'accent principale" value={cfg.accentColor} onChange={set("accentColor")} />
              <ColorPicker label="Couleur d'accent secondaire" value={cfg.accentColorAlt} onChange={set("accentColorAlt")} />
              <ColorPicker label="Fond de page" value={cfg.bodyBg} onChange={set("bodyBg")} />
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-gray-700 text-sm font-bold mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#25D366]" /> Contact WhatsApp
              </h3>
              <TextField label="Numéro WhatsApp (avec indicatif)" value={cfg.whatsapp} placeholder="+2250700000000" onChange={set("whatsapp")} />
              <p className="text-gray-400 text-xs mt-1.5">Ce numéro sera utilisé sur tous les boutons WhatsApp de la plateforme.</p>
            </div>

            {/* Auto-contrast demo */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-gray-700 text-sm font-bold mb-3">Contraste automatique</h3>
              <p className="text-gray-400 text-sm mb-3">Le texte s'adapte automatiquement selon la luminosité du fond :</p>
              <div className="grid grid-cols-4 gap-2">
                {["#FFFFFF", "#F97316", "#1F2937", "#6B7280"].map((bg) => {
                  // getContrastColor logic
                  const hex = bg.replace("#", "");
                  const r = parseInt(hex.slice(0, 2), 16) / 255;
                  const g = parseInt(hex.slice(2, 4), 16) / 255;
                  const b = parseInt(hex.slice(4, 6), 16) / 255;
                  const [rs, gs, bs] = [r, g, b].map((c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
                  const L = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
                  const textColor = L > 0.4 ? "#111827" : "#FFFFFF";
                  return (
                    <div key={bg} className="h-12 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{ background: bg, color: textColor }}>
                      {textColor === "#111827" ? "Texte foncé" : "Texte clair"}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
