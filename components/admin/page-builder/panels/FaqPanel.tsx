"use client";

import { FaqProps } from "@/lib/types/page-builder";
import { Plus, Trash2, GripVertical } from "lucide-react";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function FaqPanel({ props, onChange }: P) {
  const p = props as unknown as FaqProps;
  const items = p.items || [];
  const setItems = (it: typeof items) => onChange({ ...props, items: it });
  const set = (key: string, v: string) => onChange({ ...props, [key]: v });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Titre</label>
        <Input value={p.heading || ""} onChange={v => set("heading", v)} placeholder="Questions fréquentes" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Sous-titre</label>
        <Input value={p.subheading || ""} onChange={v => set("subheading", v)} placeholder="Tout ce que vous devez savoir" />
      </div>
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Questions ({items.length})</p>
          <button onClick={() => setItems([...items, { question: "", answer: "" }])}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-xs rounded-lg transition-colors">
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-white/20 flex-shrink-0" />
                <span className="text-xs text-white/30 font-mono">#{i + 1}</span>
                <button onClick={() => setItems(items.filter((_, j) => j !== i))}
                  className="ml-auto text-white/20 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
              <Input value={item.question} onChange={v => setItems(items.map((it, j) => j === i ? { ...it, question: v } : it))} placeholder="Question..." />
              <textarea value={item.answer} onChange={e => setItems(items.map((it, j) => j === i ? { ...it, answer: e.target.value } : it))}
                rows={2} placeholder="Réponse..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40 resize-none" />
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-white/20 text-xs py-4">Aucune question. Cliquez sur Ajouter.</p>}
        </div>
      </div>
    </div>
  );
}
