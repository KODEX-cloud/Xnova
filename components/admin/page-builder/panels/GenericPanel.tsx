"use client";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

export default function GenericPanel({ props, onChange }: P) {
  const entries = Object.entries(props);

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-6">Cette section n'a pas de propriétés configurables.</p>
      ) : (
        entries.map(([key, val]) => {
          if (typeof val === "boolean") {
            return (
              <div key={key}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => onChange({ ...props, [key]: !val })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${val ? "bg-nova-red" : "bg-white/10"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-sm text-white/70">{key}</span>
                </label>
              </div>
            );
          }
          if (typeof val === "number") {
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{key}</label>
                <input type="number" value={val}
                  onChange={e => onChange({ ...props, [key]: +e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nova-red/40" />
              </div>
            );
          }
          if (typeof val === "string") {
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{key}</label>
                <input value={val} onChange={e => onChange({ ...props, [key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
              </div>
            );
          }
          return null;
        })
      )}
    </div>
  );
}
