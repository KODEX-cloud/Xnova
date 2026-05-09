"use client";

import { ServicesProps } from "@/lib/types/page-builder";
import { Plus, Trash2 } from "lucide-react";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function ServicesPanel({ props, onChange }: P) {
  const p = props as unknown as ServicesProps;
  const items = p.items || [];
  const setItems = (it: typeof items) => onChange({ ...props, items: it });

  return (
    <div className="space-y-4">
      <div><label className="block text-xs font-medium text-white/50 mb-1.5">Titre</label><Input value={p.heading || ""} onChange={v => onChange({ ...props, heading: v })} placeholder="Nos services" /></div>
      <div><label className="block text-xs font-medium text-white/50 mb-1.5">Sous-titre</label><Input value={p.subheading || ""} onChange={v => onChange({ ...props, subheading: v })} placeholder="Des solutions complètes..." /></div>
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Services ({items.length})</p>
          <button onClick={() => setItems([...items, { icon: "Star", title: "", description: "" }])}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-xs rounded-lg transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">Service #{i + 1}</span>
                <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <Input value={item.icon} onChange={v => setItems(items.map((it, j) => j === i ? { ...it, icon: v } : it))} placeholder="Icône (ex: Car, Building2, Key)" />
              <Input value={item.title} onChange={v => setItems(items.map((it, j) => j === i ? { ...it, title: v } : it))} placeholder="Titre du service" />
              <Input value={item.description} onChange={v => setItems(items.map((it, j) => j === i ? { ...it, description: v } : it))} placeholder="Description courte" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
