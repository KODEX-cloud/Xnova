"use client";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };
const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
);

export default function ContactPanel({ props, onChange }: P) {
  const set = (key: string, v: unknown) => onChange({ ...props, [key]: v });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Titre</label>
        <Input value={(props.heading as string) || ""} onChange={v => set("heading", v)} placeholder="Contactez-nous" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Sous-titre</label>
        <textarea value={(props.subheading as string) || ""} onChange={e => set("subheading", e.target.value)} rows={2}
          placeholder="Notre équipe vous répond sous 24h..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40 resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Texte du bouton</label>
        <Input value={(props.btnText as string) || ""} onChange={v => set("btnText", v)} placeholder="Envoyer le message" />
      </div>
      <div className="border-t border-white/5 pt-4 space-y-3">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Carte & Localisation</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => set("showMap", !props.showMap)}
            className={`w-9 h-5 rounded-full transition-colors relative ${props.showMap ? "bg-nova-red" : "bg-white/10"}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${props.showMap ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>

          <span className="text-sm text-white/70">Afficher la carte Google Maps</span>
        </label>
        {!!props.showMap && (
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">URL Google Maps Embed</label>
            <Input value={(props.mapUrl as string) || ""} onChange={v => set("mapUrl", v)}
              placeholder="https://maps.google.com/maps?q=..." />
            <p className="text-xs text-white/30 mt-1">Google Maps → Partager → Intégrer une carte → copier src="..."</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Adresse physique</label>
          <Input value={(props.address as string) || ""} onChange={v => set("address", v)} placeholder="Abidjan, Cocody..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Téléphone affiché</label>
          <Input value={(props.phone as string) || ""} onChange={v => set("phone", v)} placeholder="+225 07 XX XX XX XX" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email affiché</label>
          <Input value={(props.email as string) || ""} onChange={v => set("email", v)} placeholder="contact@nova.ci" />
        </div>
      </div>
    </div>
  );
}
