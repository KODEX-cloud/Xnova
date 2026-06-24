"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import {
  ArrowLeft, Save, ExternalLink, Plus, Trash2, ChevronUp, ChevronDown,
  Loader2, Check, Eye, EyeOff, X, ChevronDown as Expand,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PageSection, SectionType } from "@/lib/types/page-builder";
import { SECTION_DEFAULTS, SECTION_META } from "@/lib/types/page-builder";

// ─── Pages that use the section builder ──────────────────────────────────────
const SECTION_BUILDER_PAGES = ["home"];

// ─── Human-readable page labels ──────────────────────────────────────────────
const PAGE_LABELS: Record<string, string> = {
  home: "Accueil", about: "À propos", services: "Services",
  contact: "Contact", automobile: "Automobile", immobilier: "Immobilier",
  blog: "Blog", annonces: "Annonces",
  faq: "FAQ", confidentialite: "Confidentialité", cgu: "CGU",
  "services/location-voiture": "Location de Voiture",
  "services/location-immo": "Location Immobilier",
  "services/achat-vente-immo": "Achat / Vente Immo",
  "services/pieces-auto": "Pièces Auto",
  "services/flotte": "Gestion de Flotte",
};

// ─── Content field definitions per page slug ─────────────────────────────────
type ContentField = {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea";
  group?: string;
};

const PAGE_CONTENT_FIELDS: Record<string, ContentField[]> = {
  services: [
    { group: "Section Hero", key: "hero.badge",    label: "Petit badge au-dessus du titre", hint: "Ex : Nos services exclusifs",               type: "text" },
    { group: "Section Hero", key: "hero.title1",   label: "Titre — 1ʳᵉ ligne",              hint: "Ex : Des services conçus",                 type: "text" },
    { group: "Section Hero", key: "hero.title2",   label: "Titre — 2ᵉ ligne (colorée)",     hint: "Ex : pour votre confort",                  type: "text" },
    { group: "Section Hero", key: "hero.subtitle", label: "Description sous le titre",       hint: "Phrase d'accroche courte",                 type: "textarea" },
    { group: "Section Hero", key: "hero.hl1",      label: "Avantage 1",                      hint: "Ex : Disponible 24h/24",                   type: "text" },
    { group: "Section Hero", key: "hero.hl2",      label: "Avantage 2",                      hint: "Ex : Service garanti",                     type: "text" },
    { group: "Section Hero", key: "hero.hl3",      label: "Avantage 3",                      hint: "Ex : Réponse en 2h",                       type: "text" },
    { group: "Section Hero", key: "hero.hl4",      label: "Avantage 4",                      hint: "Ex : +500 clients satisfaits",             type: "text" },
    { group: "Bannière finale", key: "cta.title",   label: "Titre de la bannière orange",    hint: "Ex : Besoin d'un service sur mesure ?",    type: "text" },
    { group: "Bannière finale", key: "cta.subtitle",label: "Sous-titre de la bannière",      hint: "Texte explicatif",                         type: "textarea" },
    { group: "Bannière finale", key: "cta.btn",     label: "Texte du bouton",                hint: "Ex : Parler à un expert",                  type: "text" },
    { group: "Bannière finale", key: "cta.footer",  label: "Petit texte sous le bouton",     hint: "Ex : Réponse garantie en moins de 2 heures", type: "text" },
  ],
  blog: [
    { group: "En-tête de la page", key: "hero.badge",    label: "Badge",        hint: "Ex : Articles & Actualités", type: "text" },
    { group: "En-tête de la page", key: "hero.title",    label: "Titre",        hint: "Ex : Blog & Conseils",       type: "text" },
    { group: "En-tête de la page", key: "hero.subtitle", label: "Sous-titre",   hint: "Ex : Découvrez nos meilleurs articles...", type: "textarea" },
  ],
  contact: [
    { group: "En-tête", key: "hero.title",      label: "Titre de la page",        hint: "Ex : Contactez-nous",                       type: "text" },
    { group: "En-tête", key: "hero.subtitle",   label: "Sous-titre",              hint: "Ex : Notre équipe est à votre disposition.", type: "textarea" },
    { group: "Informations", key: "hours",      label: "Horaires d'ouverture",    hint: "Ex : Lun–Sam · 8h à 19h",                   type: "text" },
    { group: "Informations", key: "hours.note", label: "Note sur les horaires",   hint: "Ex : Fermé les dimanches",                   type: "text" },
    { group: "CTA final", key: "cta.title",     label: "Titre du bandeau final",  hint: "Ex : Besoin d'aide immédiatement ?",          type: "text" },
    { group: "CTA final", key: "cta.subtitle",  label: "Sous-titre du bandeau",   hint: "Ex : Contactez-nous par WhatsApp",           type: "text" },
  ],
  annonces: [
    { group: "En-tête", key: "hero.title",    label: "Titre de la page", hint: "Ex : Toutes nos annonces",              type: "text" },
    { group: "En-tête", key: "hero.subtitle", label: "Sous-titre",        hint: "Ex : Voitures et biens à Abidjan",     type: "textarea" },
  ],
  automobile: [
    { group: "En-tête", key: "hero.title",    label: "Titre de la page", hint: "Ex : Catalogue Automobile",            type: "text" },
    { group: "En-tête", key: "hero.subtitle", label: "Sous-titre",        hint: "Ex : Les meilleures voitures d'Abidjan", type: "textarea" },
    { group: "En-tête", key: "hero.badge",    label: "Badge",             hint: "Ex : Voitures de luxe",                type: "text" },
  ],
  immobilier: [
    { group: "En-tête", key: "hero.title",    label: "Titre de la page", hint: "Ex : Catalogue Immobilier",            type: "text" },
    { group: "En-tête", key: "hero.subtitle", label: "Sous-titre",        hint: "Ex : Villas, appartements, terrains", type: "textarea" },
    { group: "En-tête", key: "hero.badge",    label: "Badge",             hint: "Ex : Immobilier premium",             type: "text" },
  ],
  about: [
    { group: "Section principale", key: "hero.title",      label: "Titre principal",         hint: "Ex : À propos de NOVA",             type: "text" },
    { group: "Section principale", key: "hero.subtitle",   label: "Sous-titre",              hint: "Ex : Votre partenaire de confiance", type: "textarea" },
    { group: "Notre histoire",     key: "story.title",     label: "Titre de la section",     hint: "Ex : Notre histoire",               type: "text" },
    { group: "Notre histoire",     key: "story.text",      label: "Texte",                   hint: "Racontez l'histoire de NOVA",        type: "textarea" },
    { group: "Notre mission",      key: "mission.title",   label: "Titre",                   hint: "Ex : Notre mission",                type: "text" },
    { group: "Notre mission",      key: "mission.text",    label: "Texte",                   hint: "Décrivez la mission de NOVA",        type: "textarea" },
    { group: "Nos valeurs",        key: "values.title",    label: "Titre de la section",                                                type: "text" },
    { group: "Nos valeurs",        key: "values.v1.label", label: "Valeur 1 — Nom",          hint: "Ex : Excellence",                   type: "text" },
    { group: "Nos valeurs",        key: "values.v1.text",  label: "Valeur 1 — Description",                                            type: "textarea" },
    { group: "Nos valeurs",        key: "values.v2.label", label: "Valeur 2 — Nom",          hint: "Ex : Confiance",                    type: "text" },
    { group: "Nos valeurs",        key: "values.v2.text",  label: "Valeur 2 — Description",                                            type: "textarea" },
    { group: "Nos valeurs",        key: "values.v3.label", label: "Valeur 3 — Nom",          hint: "Ex : Innovation",                   type: "text" },
    { group: "Nos valeurs",        key: "values.v3.text",  label: "Valeur 3 — Description",                                            type: "textarea" },
    { group: "Bannière finale",    key: "cta.title",       label: "Titre",                   hint: "Ex : Rejoignez la famille NOVA",    type: "text" },
    { group: "Bannière finale",    key: "cta.subtitle",    label: "Sous-titre",                                                         type: "textarea" },
    { group: "Bannière finale",    key: "cta.btn",         label: "Texte du bouton",          hint: "Ex : Contactez-nous",              type: "text" },
  ],
  faq: [
    { group: "En-tête", key: "hero.title",    label: "Titre de la page FAQ",  hint: "Ex : Questions fréquentes", type: "text" },
    { group: "En-tête", key: "hero.subtitle", label: "Sous-titre",             hint: "Ex : Trouvez vos réponses rapidement", type: "textarea" },
  ],
  confidentialite: [
    { group: "Contenu", key: "content", label: "Texte de la politique de confidentialité", hint: "Texte complet (supports ## titres et - listes)", type: "textarea" },
  ],
  cgu: [
    { group: "Contenu", key: "content", label: "Texte des conditions générales d'utilisation", hint: "Texte complet (supports ## titres et - listes)", type: "textarea" },
  ],
  "services/location-voiture": [
    { group: "Textes principaux", key: "hero.title",    label: "Titre du service",           hint: "Ex : Location de Voiture", type: "text" },
    { group: "Textes principaux", key: "hero.subtitle", label: "Sous-titre",                  hint: "Ex : Courte & longue durée", type: "textarea" },
    { group: "Textes principaux", key: "description",   label: "Description complète",        hint: "Texte de présentation",    type: "textarea" },
    { group: "Textes principaux", key: "cta.btn",       label: "Texte du bouton de contact",  hint: "Ex : Réserver maintenant", type: "text" },
    { group: "Textes principaux", key: "tag",           label: "Badge/Tag",                   hint: "Ex : Populaire",           type: "text" },
    { group: "Fonctionnalités",   key: "features",      label: "Points forts (une ligne = un point)", hint: "Ex :\nChauffeur disponible\nVéhicules récents", type: "textarea" },
    { group: "Galerie photos",    key: "gallery",       label: "URLs des photos (une par ligne)", hint: "Collez les URLs des images", type: "textarea" },
  ],
  "services/location-immo": [
    { group: "Textes principaux", key: "hero.title",    label: "Titre du service",  type: "text" },
    { group: "Textes principaux", key: "hero.subtitle", label: "Sous-titre",        type: "textarea" },
    { group: "Textes principaux", key: "description",   label: "Description complète", type: "textarea" },
    { group: "Textes principaux", key: "cta.btn",       label: "Texte du bouton",   type: "text" },
    { group: "Textes principaux", key: "tag",           label: "Badge/Tag",          type: "text" },
    { group: "Fonctionnalités",   key: "features",      label: "Points forts (une ligne = un point)", type: "textarea" },
    { group: "Galerie photos",    key: "gallery",       label: "URLs des photos (une par ligne)", type: "textarea" },
  ],
  "services/achat-vente-immo": [
    { group: "Textes principaux", key: "hero.title",    label: "Titre du service",  type: "text" },
    { group: "Textes principaux", key: "hero.subtitle", label: "Sous-titre",        type: "textarea" },
    { group: "Textes principaux", key: "description",   label: "Description complète", type: "textarea" },
    { group: "Textes principaux", key: "cta.btn",       label: "Texte du bouton",   type: "text" },
    { group: "Textes principaux", key: "tag",           label: "Badge/Tag",          type: "text" },
    { group: "Fonctionnalités",   key: "features",      label: "Points forts (une ligne = un point)", type: "textarea" },
    { group: "Galerie photos",    key: "gallery",       label: "URLs des photos (une par ligne)", type: "textarea" },
  ],
  "services/pieces-auto": [
    { group: "Textes principaux", key: "hero.title",    label: "Titre du service",  type: "text" },
    { group: "Textes principaux", key: "hero.subtitle", label: "Sous-titre",        type: "textarea" },
    { group: "Textes principaux", key: "description",   label: "Description complète", type: "textarea" },
    { group: "Textes principaux", key: "cta.btn",       label: "Texte du bouton",   type: "text" },
    { group: "Textes principaux", key: "tag",           label: "Badge/Tag",          type: "text" },
    { group: "Fonctionnalités",   key: "features",      label: "Points forts (une ligne = un point)", type: "textarea" },
    { group: "Galerie photos",    key: "gallery",       label: "URLs des photos (une par ligne)", type: "textarea" },
  ],
  "services/flotte": [
    { group: "Textes principaux", key: "hero.title",    label: "Titre du service",  type: "text" },
    { group: "Textes principaux", key: "hero.subtitle", label: "Sous-titre",        type: "textarea" },
    { group: "Textes principaux", key: "description",   label: "Description complète", type: "textarea" },
    { group: "Textes principaux", key: "cta.btn",       label: "Texte du bouton",   type: "text" },
    { group: "Textes principaux", key: "tag",           label: "Badge/Tag",          type: "text" },
    { group: "Fonctionnalités",   key: "features",      label: "Points forts (une ligne = un point)", type: "textarea" },
    { group: "Galerie photos",    key: "gallery",       label: "URLs des photos (une par ligne)", type: "textarea" },
  ],
};

const FIELD_DEFAULTS: Record<string, Record<string, string>> = {
  services: {
    "hero.badge":    "Nos services exclusifs",
    "hero.title1":   "Des services conçus",
    "hero.title2":   "pour votre confort",
    "hero.subtitle": "De la location de véhicule à la gestion immobilière, NOVA vous offre des solutions premium complètes à Abidjan.",
    "hero.hl1": "Disponible 24h/24", "hero.hl2": "Service garanti",
    "hero.hl3": "Réponse en 2h",     "hero.hl4": "+500 clients satisfaits",
    "cta.title":    "Besoin d'un service sur mesure ?",
    "cta.subtitle": "Notre équipe est disponible pour étudier votre demande.",
    "cta.btn":      "Parler à un expert",
    "cta.footer":   "Réponse garantie en moins de 2 heures",
  },
  blog: {
    "hero.badge":    "Articles & Actualités",
    "hero.title":    "Blog & Conseils",
    "hero.subtitle": "Découvrez nos meilleurs articles sur l'automobile, l'immobilier et bien plus.",
  },
  contact: {
    "hero.title":    "Contactez-nous",
    "hero.subtitle": "Notre équipe est à votre disposition pour toutes vos questions.",
    "hours":         "Lun–Sam · 8h à 19h",
    "hours.note":    "Réponse WhatsApp 24h/24",
  },
};

// ─── Section builder types ────────────────────────────────────────────────────
type SectionFieldDef =
  | { key: string; label: string; hint?: string; type: "text" | "textarea" | "url" | "number" }
  | { key: string; label: string; hint?: string; type: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; hint?: string; type: "toggle" }
  | { key: string; label: string; hint?: string; type: "faq" }
  | { key: string; label: string; hint?: string; type: "lines" };

const SECTION_FIELDS: Partial<Record<SectionType, SectionFieldDef[]>> = {
  hero: [
    { key: "badge",            label: "Texte du badge",           hint: "Ex : Marketplace #1",     type: "text" },
    { key: "line1",            label: "Titre — 1ʳᵉ ligne",        hint: "Ex : Votre Partenaire",    type: "text" },
    { key: "line2",            label: "Titre — 2ᵉ ligne",         hint: "Ex : Premium CI",          type: "text" },
    { key: "subtitle",         label: "Sous-titre",                hint: "Phrase d'accroche",        type: "textarea" },
    { key: "backgroundImage",  label: "Image de fond (URL)",      hint: "Copiez-collez l'URL",      type: "url" },
    { key: "primaryBtnText",   label: "Bouton principal — texte",  type: "text" },
    { key: "primaryBtnHref",   label: "Bouton principal — lien",   type: "text" },
    { key: "secondaryBtnText", label: "Bouton secondaire — texte", type: "text" },
    { key: "secondaryBtnHref", label: "Bouton secondaire — lien",  type: "text" },
  ],
  cta: [
    { key: "heading",    label: "Titre principal", type: "text" },
    { key: "subheading", label: "Sous-titre",      type: "textarea" },
    { key: "btnText",    label: "Texte du bouton", type: "text" },
    { key: "btnHref",    label: "Lien du bouton",  hint: "Ex : /contact", type: "text" },
    { key: "variant", label: "Style", type: "select", options: [
      { value: "gradient", label: "Dégradé coloré" },
      { value: "solid",    label: "Fond plein" },
      { value: "outline",  label: "Contour" },
    ]},
  ],
  listings: [
    { key: "heading",     label: "Titre",            type: "text" },
    { key: "subheading",  label: "Sous-titre",       type: "textarea" },
    { key: "listingType", label: "Quoi afficher ?",  type: "select", options: [
      { value: "both",       label: "Voitures + Immobilier" },
      { value: "cars",       label: "Voitures uniquement" },
      { value: "properties", label: "Immobilier uniquement" },
    ]},
    { key: "limit",       label: "Nombre d'annonces", hint: "Ex : 6", type: "number" },
    { key: "featuredOnly",label: "Vedette uniquement", type: "toggle" },
  ],
  stats:        [{ key: "heading", label: "Titre", type: "text" }],
  testimonials: [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }],
  blog:         [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }, { key: "limit", label: "Nombre d'articles", type: "number" }],
  faq:          [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }, { key: "items", label: "Questions / Réponses", type: "faq" }],
  services:     [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }],
  gallery:      [{ key: "heading", label: "Titre", type: "text" }, { key: "images", label: "Photos (une URL par ligne)", type: "lines" }, { key: "columns", label: "Colonnes", type: "number" }],
  contact:      [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }, { key: "showMap", label: "Afficher la carte", type: "toggle" }],
  richtext:     [{ key: "content", label: "Contenu", type: "textarea" }],
  search:       [{ key: "heading", label: "Titre", type: "text" }],
  promotions:   [{ key: "heading", label: "Titre", type: "text" }, { key: "subheading", label: "Sous-titre", type: "textarea" }],
};

const ADD_CHOICES: { type: SectionType; icon: string; label: string }[] = [
  { type: "hero",         icon: "🎯", label: "Grande bannière" },
  { type: "listings",     icon: "🏷️", label: "Annonces" },
  { type: "services",     icon: "🛠️", label: "Services" },
  { type: "stats",        icon: "📊", label: "Statistiques" },
  { type: "testimonials", icon: "💬", label: "Témoignages" },
  { type: "blog",         icon: "📰", label: "Articles Blog" },
  { type: "faq",          icon: "❓", label: "FAQ" },
  { type: "cta",          icon: "⚡", label: "Bouton d'action" },
  { type: "gallery",      icon: "🖼️", label: "Galerie photos" },
  { type: "contact",      icon: "📧", label: "Contact" },
  { type: "richtext",     icon: "✏️", label: "Texte libre" },
  { type: "promotions",   icon: "🎁", label: "Promotions" },
];

// ─── Generic input ────────────────────────────────────────────────────────────
function Inp({ label, hint, value, onChange, multiline }: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; multiline?: boolean;
}) {
  const cls = "w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors";
  return (
    <div className="space-y-1.5">
      <label className="block text-white/70 text-sm font-medium">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={hint} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={hint} className={cls} />
      }
    </div>
  );
}

// ─── Section field renderer ───────────────────────────────────────────────────
function SectionFieldEditor({ def, value, onChange }: { def: SectionFieldDef; value: any; onChange: (v: any) => void }) {
  const cls = "w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors";
  if (def.type === "text" || def.type === "url")
    return <input type="text" value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={def.hint} className={cls} />;
  if (def.type === "textarea")
    return <textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} />;
  if (def.type === "number")
    return <input type="number" value={value ?? 0} onChange={e => onChange(Number(e.target.value))} className={`${cls} w-32`} />;
  if (def.type === "select")
    return (
      <select value={value ?? ""} onChange={e => onChange(e.target.value)} className={`${cls} bg-[#1A2232] cursor-pointer`}>
        {def.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  if (def.type === "toggle")
    return (
      <button type="button" onClick={() => onChange(!value)}
        className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all", value ? "bg-nova-red/10 border-nova-red/30 text-nova-red" : "bg-white/[0.03] border-white/10 text-white/40")}>
        <div className={cn("w-9 h-5 rounded-full relative transition-colors", value ? "bg-nova-red" : "bg-white/15")}>
          <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", value ? "translate-x-4" : "translate-x-0.5")} />
        </div>
        {value ? "Activé" : "Désactivé"}
      </button>
    );
  if (def.type === "lines")
    return (
      <textarea value={Array.isArray(value) ? value.join("\n") : (value ?? "")}
        onChange={e => onChange(e.target.value.split("\n").map((s: string) => s.trim()).filter(Boolean))}
        rows={4} placeholder="Une URL par ligne" className={`${cls} resize-none font-mono text-xs`} />
    );
  if (def.type === "faq") {
    const items: { question: string; answer: string }[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-[#0D1117] border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/40 text-xs">Question {i + 1}</span>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors"><X size={13} /></button>
            </div>
            <input type="text" value={item.question} placeholder="Question…" onChange={e => { const n=[...items]; n[i]={...n[i],question:e.target.value}; onChange(n); }} className={cls} />
            <textarea value={item.answer} placeholder="Réponse…" rows={2} onChange={e => { const n=[...items]; n[i]={...n[i],answer:e.target.value}; onChange(n); }} className={`${cls} resize-none`} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { question: "", answer: "" }])}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-white/15 hover:border-nova-red/40 text-white/40 hover:text-nova-red rounded-xl text-sm transition-all">
          <Plus size={14} /> Ajouter une question
        </button>
      </div>
    );
  }
  return null;
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ section, index, total, onChange, onDelete, onMoveUp, onMoveDown, onToggle }: {
  section: PageSection; index: number; total: number;
  onChange: (id: string, key: string, value: any) => void;
  onDelete: (id: string) => void; onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void; onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const choice = ADD_CHOICES.find(c => c.type === section.type);
  const fields = SECTION_FIELDS[section.type] ?? [];

  return (
    <div className={cn("border rounded-2xl overflow-hidden transition-all", section.isVisible ? "border-white/8 bg-[#111827]" : "border-white/5 bg-[#0D1117] opacity-60")}>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="text-xl flex-shrink-0">{choice?.icon ?? "📄"}</span>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(o => !o)}>
          <p className="text-white font-semibold text-sm">{choice?.label ?? section.type}</p>
          <p className="text-white/30 text-xs">{SECTION_META[section.type]?.description}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onMoveUp(section.id)} disabled={index === 0} className="p-1.5 rounded-lg text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"><ChevronUp size={15} /></button>
          <button type="button" onClick={() => onMoveDown(section.id)} disabled={index === total - 1} className="p-1.5 rounded-lg text-white/20 hover:text-white/60 disabled:opacity-0 transition-colors"><ChevronDown size={15} /></button>
          <button type="button" onClick={() => onToggle(section.id)} className={cn("p-1.5 rounded-lg transition-colors", section.isVisible ? "text-nova-red/70 hover:text-nova-red" : "text-white/20 hover:text-white/50")}>
            {section.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button type="button" onClick={() => { if (confirm("Supprimer ce bloc ?")) onDelete(section.id); }} className="p-1.5 rounded-lg text-white/15 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
          <button type="button" onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 transition-colors"><Expand size={15} className={cn("transition-transform", open && "rotate-180")} /></button>
        </div>
      </div>
      {open && (
        <div className={cn("px-5 pb-6 border-t border-white/5", fields.length > 0 ? "pt-5 space-y-5" : "pt-4")}>
          {fields.length > 0
            ? fields.map(f => (
                <div key={f.key}>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">{f.label}</label>
                  {f.hint && <p className="text-white/30 text-xs mb-1.5">{f.hint}</p>}
                  <SectionFieldEditor def={f} value={section.props[f.key]} onChange={v => onChange(section.id, f.key, v)} />
                </div>
              ))
            : <p className="text-white/25 text-sm">Ce bloc affiche du contenu depuis la base de données automatiquement.</p>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT EDITOR MODE
// ═══════════════════════════════════════════════════════════════════════════════

function ContentEditor({ slug, pageLabel, frontHref }: { slug: string; pageLabel: string; frontHref: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fields = PAGE_CONTENT_FIELDS[slug] ?? [];
  const defaults = FIELD_DEFAULTS[slug] ?? {};

  const groups = fields.reduce<Record<string, ContentField[]>>((acc, f) => {
    const g = f.group ?? "Général";
    if (!acc[g]) acc[g] = [];
    acc[g].push(f);
    return acc;
  }, {});

  useEffect(() => {
    fetch(`/api/settings?prefix=${encodeURIComponent(`page.${slug}.`)}`)
      .then(r => r.json())
      .then(data => { setValues(data || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const body: Record<string, string> = {};
    Object.entries(values).forEach(([k, v]) => { body[`page.${slug}.${k}`] = v; });
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }));
  const get = (key: string) => values[key] ?? "";

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;

  if (fields.length === 0) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-4xl mb-3">🚧</p>
      <p className="text-white/50 font-semibold mb-1">Éditeur en cours de préparation</p>
      <p className="text-white/25 text-sm">Les champs pour cette page seront disponibles prochainement.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/pages")} className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">{pageLabel}</h1>
            <a href={frontHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/30 hover:text-white/60 text-xs transition-colors">
              <ExternalLink size={10} /> Voir la page
            </a>
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-nova-red/20">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Sauvegardé !" : "Enregistrer"}
        </button>
      </div>

      <div className="bg-blue-500/8 border border-blue-500/15 rounded-2xl px-5 py-4 flex gap-3">
        <Settings2 size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300/80 text-sm">
          Modifiez les textes ci-dessous, puis cliquez sur <strong>Enregistrer</strong>.
          Les champs vides afficheront le texte par défaut du site.
        </p>
      </div>

      {Object.entries(groups).map(([groupName, groupFields]) => (
        <div key={groupName} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{groupName}</p>
          </div>
          <div className="p-5 space-y-5">
            {groupFields.map(f => (
              <Inp
                key={f.key}
                label={f.label}
                hint={f.hint ?? defaults[f.key]}
                value={get(f.key)}
                onChange={v => set(f.key, v)}
                multiline={f.type === "textarea"}
              />
            ))}
          </div>
        </div>
      ))}

      <p className="text-center text-white/20 text-xs pb-4">
        N'oubliez pas de cliquer sur <strong className="text-white/40">Enregistrer</strong> pour publier vos modifications.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION BUILDER MODE (home only)
// ═══════════════════════════════════════════════════════════════════════════════

function SectionBuilder({ slug, pageLabel, frontHref }: { slug: string; pageLabel: string; frontHref: string }) {
  const router = useRouter();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}/sections`)
      .then(r => r.json())
      .then(data => { const raw = data?.sections ?? data; setSections(Array.isArray(raw) ? raw : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const save = useCallback(async () => {
    setSaving(true); setSaved(false);
    await fetch(`/api/pages/${slug}/sections`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [sections, slug]);

  const addSection = (type: SectionType) => {
    setSections(prev => [...prev, {
      id: nanoid(), type, order: prev.length, isVisible: true,
      label: SECTION_META[type].label,
      props: { ...SECTION_DEFAULTS[type] },
    }]);
    setShowAdd(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>;

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/pages")} className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-white font-bold text-xl">{pageLabel}</h1>
            <a href={frontHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/30 hover:text-white/60 text-xs transition-colors">
              <ExternalLink size={10} /> Voir la page
            </a>
          </div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl transition-colors disabled:opacity-60 shadow-sm shadow-nova-red/20">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Sauvegardé !" : "Enregistrer"}
        </button>
      </div>

      {sections.length === 0 && (
        <div className="text-center py-16 bg-[#111827] border border-white/5 rounded-2xl">
          <p className="text-4xl mb-3">✨</p>
          <p className="text-white/70 font-semibold mb-1">Page vide</p>
          <p className="text-white/30 text-sm mb-5">Ajoutez votre premier bloc pour commencer.</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 bg-nova-red text-white font-semibold rounded-xl mx-auto hover:bg-nova-red/90 transition-colors">
            <Plus size={16} /> Ajouter un bloc
          </button>
        </div>
      )}

      {sections.map((section, i) => (
        <SectionCard key={section.id} section={section} index={i} total={sections.length}
          onChange={(id, key, val) => setSections(prev => prev.map(s => s.id === id ? { ...s, props: { ...s.props, [key]: val } } : s))}
          onDelete={id => setSections(prev => prev.filter(s => s.id !== id))}
          onMoveUp={id => setSections(prev => { const idx = prev.findIndex(s => s.id === id); if (idx === 0) return prev; const n=[...prev]; [n[idx-1],n[idx]]=[n[idx],n[idx-1]]; return n; })}
          onMoveDown={id => setSections(prev => { const idx = prev.findIndex(s => s.id === id); if (idx===prev.length-1) return prev; const n=[...prev]; [n[idx],n[idx+1]]=[n[idx+1],n[idx]]; return n; })}
          onToggle={id => setSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s))}
        />
      ))}

      {sections.length > 0 && (
        <button onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/10 hover:border-nova-red/40 text-white/30 hover:text-nova-red rounded-2xl text-sm font-medium transition-all">
          <Plus size={18} /> Ajouter un nouveau bloc
        </button>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Quel bloc ajouter ?</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {ADD_CHOICES.map(c => (
                <button key={c.type} type="button" onClick={() => addSection(c.type)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-nova-red/30 hover:bg-nova-red/5 text-left transition-all group">
                  <span className="text-2xl">{c.icon}</span>
                  <p className="text-white text-sm font-semibold group-hover:text-nova-red transition-colors">{c.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROUTER — catch-all slug
// ═══════════════════════════════════════════════════════════════════════════════

export default function PageEditorRouter() {
  const params = useParams<{ slug: string[] }>();
  // Join segments so "services/achat-vente-immo" works as a single key
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : (params.slug || "home");

  const pageLabel = PAGE_LABELS[slug] || slug;
  const frontHref = slug === "home" ? "/" : `/${slug}`;
  const useSectionBuilder = SECTION_BUILDER_PAGES.includes(slug);

  if (useSectionBuilder) {
    return <SectionBuilder slug={slug} pageLabel={pageLabel} frontHref={frontHref} />;
  }
  return <ContentEditor slug={slug} pageLabel={pageLabel} frontHref={frontHref} />;
}
