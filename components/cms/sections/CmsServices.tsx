import { ServicesProps } from "@/lib/types/page-builder";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, string> = {
  Car: "🚗", Building2: "🏢", Key: "🔑", Shield: "🛡️", Zap: "⚡",
  Home: "🏠", Star: "⭐", Tool: "🔧", Wrench: "🔧", Users: "👥",
};

const COLORS = [
  "from-orange-500 to-orange-400",
  "from-blue-500 to-blue-400",
  "from-emerald-500 to-emerald-400",
  "from-purple-500 to-purple-400",
  "from-rose-500 to-rose-400",
  "from-amber-500 to-amber-400",
];

export default function CmsServices({ props }: { props: ServicesProps }) {
  const {
    heading = "Nos services",
    subheading = "Des solutions complètes pour vos besoins automobile et immobilier",
    items = [],
  } = props;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            <span className="section-label inline-flex items-center gap-2 mb-4">
              <ArrowRight className="h-3.5 w-3.5" /> Services
            </span>
            {heading && <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{heading}</h2>}
            {subheading && <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subheading}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                {ICON_MAP[item.icon] || "⚙️"}
              </div>
              <h3 className="text-gray-900 font-bold text-base mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
