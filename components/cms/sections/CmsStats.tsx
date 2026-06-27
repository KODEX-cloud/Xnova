import { StatsProps } from "@/lib/types/page-builder";

const ICON_MAP: Record<string, string> = {
  Car: "🚗", Home: "🏠", Users: "👥", Star: "⭐", Building2: "🏢",
  Shield: "🛡️", Zap: "⚡", CheckCircle2: "✅", TrendingUp: "📈",
};

export default function CmsStats({ props }: { props: StatsProps }) {
  const { heading = "La confiance, ça se mesure", items = [] } = props;

  const COLORS = [
    { bg: "bg-orange-50 border-orange-200", text: "text-nova-red", icon: "bg-orange-100" },
    { bg: "bg-amber-50 border-amber-200", text: "text-amber-600", icon: "bg-amber-100" },
    { bg: "bg-blue-50 border-blue-200", text: "text-blue-600", icon: "bg-blue-100" },
    { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-600", icon: "bg-emerald-100" },
    { bg: "bg-purple-50 border-purple-200", text: "text-purple-600", icon: "bg-purple-100" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">{heading}</h2>
        )}
        <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(items.length, 4)} gap-6`}>
          {items.map((item, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <div key={i} className={`p-6 rounded-2xl border-2 ${c.bg} text-center`}>
                <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {ICON_MAP[item.icon] || "📊"}
                </div>
                <p className={`text-4xl font-black ${c.text} mb-1`}>
                  {item.value}{item.suffix}
                </p>
                <p className="text-gray-800 font-semibold text-sm mb-1">{item.label}</p>
                {item.description && (
                  <p className="text-gray-400 text-xs">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
