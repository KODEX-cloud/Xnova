"use client";

import { CtaProps } from "@/lib/types/page-builder";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);
const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>{children}</div>
);

export default function CtaPanel({ props, onChange }: P) {
  const p = props as unknown as CtaProps;
  const set = (key: string, v: string) => onChange({ ...props, [key]: v });
  return (
    <div className="space-y-4">
      <F label="Titre"><Input value={p.heading || ""} onChange={v => set("heading", v)} placeholder="Prêt à commencer ?" /></F>
      <F label="Sous-titre"><Input value={p.subheading || ""} onChange={v => set("subheading", v)} placeholder="Rejoignez des milliers de clients..." /></F>
      <F label="Texte du bouton"><Input value={p.btnText || ""} onChange={v => set("btnText", v)} placeholder="Commencer maintenant" /></F>
      <F label="Lien du bouton"><Input value={p.btnHref || ""} onChange={v => set("btnHref", v)} placeholder="#contact" /></F>
      <F label="Style">
        <div className="grid grid-cols-3 gap-2">
          {(["gradient", "solid", "outline"] as const).map(v => (
            <button key={v} onClick={() => set("variant", v)}
              className={`py-2 text-xs rounded-lg border transition-colors ${p.variant === v ? "border-nova-red bg-nova-red/10 text-nova-red" : "border-white/10 text-white/40 hover:border-white/20"}`}>
              {v === "gradient" ? "Dégradé" : v === "solid" ? "Plein" : "Contour"}
            </button>
          ))}
        </div>
      </F>
    </div>
  );
}
