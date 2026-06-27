"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, ExternalLink } from "lucide-react";

interface PageItem {
  slug: string;
  sections?: string;
}

const PAGES = [
  {
    group: "Pages principales",
    items: [
      { slug: "home",    label: "🏠 Accueil",    hint: "La page d'accueil du site" },
      { slug: "services",label: "🛠️ Services",   hint: "Présentation de tous les services" },
      { slug: "contact", label: "📧 Contact",    hint: "Formulaire et coordonnées" },
      { slug: "about",   label: "ℹ️ À propos",   hint: "Présentation de l'entreprise" },
    ],
  },
  {
    group: "Catalogues",
    items: [
      { slug: "automobile",  label: "🚗 Automobile",  hint: "Page catalogue des voitures" },
      { slug: "immobilier",  label: "🏡 Immobilier",  hint: "Page catalogue des biens" },
      { slug: "blog",        label: "📰 Blog",        hint: "Articles et actualités" },
    ],
  },
  {
    group: "Sous-pages Services",
    items: [
      { slug: "services/location-voiture",  label: "🔑 Location de Voiture",     hint: "Service location auto" },
      { slug: "services/location-immo",     label: "🏘️ Location Immobilier",     hint: "Gestion locative" },
      { slug: "services/achat-vente-immo",  label: "🤝 Achat / Vente Immo",      hint: "Transactions immobilières" },
      { slug: "services/pieces-auto",       label: "⚙️ Pièces Auto",             hint: "Vente de pièces détachées" },
      { slug: "services/flotte",            label: "🚌 Gestion de Flotte",        hint: "Location pour entreprises" },
    ],
  },
];

export default function PagesAdmin() {
  const router = useRouter();
  const [dbPages, setDbPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages")
      .then(r => r.json())
      .then(data => { setDbPages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getSectionCount = (slug: string) => {
    const p = dbPages.find(d => d.slug === slug);
    if (!p) return 0;
    try { return JSON.parse(p.sections || "[]").length; } catch { return 0; }
  };

  const frontHref = (slug: string) => slug === "home" ? "/" : `/${slug}`;

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-white/30" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      <div>
        <h1 className="text-white text-2xl font-bold mb-1">Modifier les pages</h1>
        <p className="text-white/40 text-sm">Choisissez une page et modifiez son contenu facilement.</p>
      </div>

      {PAGES.map(group => (
        <div key={group.group}>
          <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">{group.group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map(page => {
              const count = getSectionCount(page.slug);
              return (
                <div
                  key={page.slug}
                  className="group bg-[#111827] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center gap-4 transition-all cursor-pointer hover:bg-white/[0.03]"
                  onClick={() => router.push(`/admin/pages/${page.slug}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-base">{page.label}</p>
                    <p className="text-white/35 text-sm mt-0.5 truncate">{page.hint}</p>
                    {count > 0 && (
                      <p className="text-nova-red/70 text-xs mt-1.5">{count} section{count > 1 ? "s" : ""} configurée{count > 1 ? "s" : ""}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={frontHref(page.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors"
                      title="Voir la page"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red rounded-xl text-sm font-semibold transition-colors">
                      <Pencil size={13} />
                      Modifier
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
