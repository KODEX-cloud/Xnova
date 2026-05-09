"use client";

import { HeroProps } from "@/lib/types/page-builder";
import ImageUploader from "@/components/admin/ImageUploader";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>{children}</div>
);
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function HeroPanel({ props, onChange }: P) {
  const p = props as unknown as HeroProps;
  const set = (key: keyof HeroProps, v: string) => onChange({ ...props, [key]: v });
  return (
    <div className="space-y-4">
      <F label="Badge / Accroche"><Input value={p.badge || ""} onChange={v => set("badge", v)} placeholder="Marketplace #1 en CI" /></F>
      <F label="Titre ligne 1"><Input value={p.line1 || ""} onChange={v => set("line1", v)} placeholder="Votre Partenaire" /></F>
      <F label="Titre ligne 2 (gradient)"><Input value={p.line2 || ""} onChange={v => set("line2", v)} placeholder="Premium CI" /></F>
      <F label="Sous-titre">
        <textarea value={p.subtitle || ""} onChange={e => set("subtitle", e.target.value)} rows={2}
          placeholder="Description sous le titre..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40 resize-none" />
      </F>
      <F label="Image de fond">
        <ImageUploader value={p.backgroundImage ? [p.backgroundImage] : []} onChange={urls => set("backgroundImage", urls[0] || "")} maxFiles={1} label="" />
      </F>
      <div className="border-t border-white/5 pt-4">
        <p className="text-xs font-medium text-white/40 mb-3 uppercase tracking-wider">Bouton principal</p>
        <div className="space-y-2">
          <Input value={p.primaryBtnText || ""} onChange={v => set("primaryBtnText", v)} placeholder="Texte du bouton" />
          <Input value={p.primaryBtnHref || ""} onChange={v => set("primaryBtnHref", v)} placeholder="Lien (ex: #annonces)" />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-white/40 mb-3 uppercase tracking-wider">Bouton secondaire</p>
        <div className="space-y-2">
          <Input value={p.secondaryBtnText || ""} onChange={v => set("secondaryBtnText", v)} placeholder="Texte du bouton" />
          <Input value={p.secondaryBtnHref || ""} onChange={v => set("secondaryBtnHref", v)} placeholder="Lien (ex: #contact)" />
        </div>
      </div>
    </div>
  );
}
