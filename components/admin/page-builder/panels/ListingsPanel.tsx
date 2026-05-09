"use client";

import { ListingsProps } from "@/lib/types/page-builder";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>{children}</div>
);
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function ListingsPanel({ props, onChange }: P) {
  const p = props as unknown as ListingsProps;
  const set = (key: string, v: unknown) => onChange({ ...props, [key]: v });
  return (
    <div className="space-y-4">
      <F label="Titre de section"><Input value={p.heading || ""} onChange={v => set("heading", v)} placeholder="Nos meilleures offres" /></F>
      <F label="Sous-titre"><Input value={p.subheading || ""} onChange={v => set("subheading", v)} placeholder="Sélection premium..." /></F>
      <F label="Type d'annonces">
        <select value={p.listingType || "both"} onChange={e => set("listingType", e.target.value)}
          className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nova-red/40">
          <option value="both">Automobile + Immobilier</option>
          <option value="cars">Automobile uniquement</option>
          <option value="properties">Immobilier uniquement</option>
        </select>
      </F>
      <F label={`Nombre d'annonces : ${p.limit || 6}`}>
        <input type="range" min={3} max={12} step={3} value={p.limit || 6} onChange={e => set("limit", +e.target.value)}
          className="w-full accent-nova-red" />
        <div className="flex justify-between text-xs text-white/30 mt-1"><span>3</span><span>6</span><span>9</span><span>12</span></div>
      </F>
      <F label="Filtre">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!p.featuredOnly} onChange={e => set("featuredOnly", e.target.checked)}
            className="w-4 h-4 rounded accent-nova-red" />
          <span className="text-sm text-white/60">Afficher uniquement les annonces vedettes</span>
        </label>
      </F>
    </div>
  );
}
