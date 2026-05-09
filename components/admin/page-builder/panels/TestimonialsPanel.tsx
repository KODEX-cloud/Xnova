"use client";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function TestimonialsPanel({ props, onChange }: P) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Titre</label>
        <Input value={(props.heading as string) || ""} onChange={v => onChange({ ...props, heading: v })} placeholder="Ils nous font confiance" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Sous-titre</label>
        <textarea value={(props.subheading as string) || ""} onChange={e => onChange({ ...props, subheading: e.target.value })} rows={2}
          placeholder="Des milliers de clients satisfaits..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40 resize-none" />
      </div>
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
        <p className="text-blue-400 text-xs">Les témoignages affichés sont gérés depuis la section <strong>Témoignages</strong> de l'admin (base de données).</p>
      </div>
    </div>
  );
}
