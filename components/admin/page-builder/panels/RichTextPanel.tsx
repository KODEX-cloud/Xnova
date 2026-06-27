"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

export default function RichTextPanel({ props, onChange }: P) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Titre (optionnel)</label>
        <input
          value={(props.heading as string) || ""}
          onChange={e => onChange({ ...props, heading: e.target.value })}
          placeholder="Titre de la section"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Contenu</label>
        <RichTextEditor
          value={(props.content as string) || ""}
          onChange={v => onChange({ ...props, content: v })}
          placeholder="Rédigez votre contenu..."
          minHeight={200}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Alignement</label>
        <div className="grid grid-cols-3 gap-2">
          {(["left", "center", "right"] as const).map(align => (
            <button key={align} onClick={() => onChange({ ...props, align })}
              className={`py-2 text-xs rounded-lg border transition-colors ${props.align === align || (!props.align && align === "left") ? "border-nova-red bg-nova-red/10 text-nova-red" : "border-white/10 text-white/40 hover:border-white/20"}`}>
              {align === "left" ? "Gauche" : align === "center" ? "Centré" : "Droite"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
