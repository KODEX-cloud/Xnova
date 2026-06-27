"use client";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function BlogPanel({ props, onChange }: P) {
  return (
    <div className="space-y-4">
      <div><label className="block text-xs font-medium text-white/50 mb-1.5">Titre</label><Input value={(props.heading as string) || ""} onChange={v => onChange({ ...props, heading: v })} placeholder="Nos derniers articles" /></div>
      <div><label className="block text-xs font-medium text-white/50 mb-1.5">Sous-titre</label><Input value={(props.subheading as string) || ""} onChange={v => onChange({ ...props, subheading: v })} placeholder="Conseils d'experts..." /></div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Nombre d'articles : {(props.limit as number) || 3}</label>
        <input type="range" min={2} max={9} step={1} value={(props.limit as number) || 3} onChange={e => onChange({ ...props, limit: +e.target.value })} className="w-full accent-nova-red" />
      </div>
      <div><label className="block text-xs font-medium text-white/50 mb-1.5">Catégorie (laisser vide = toutes)</label><Input value={(props.category as string) || ""} onChange={v => onChange({ ...props, category: v })} placeholder="Automobile, Immobilier..." /></div>
    </div>
  );
}
