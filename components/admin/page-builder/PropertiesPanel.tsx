"use client";

import { PageSection } from "@/lib/types/page-builder";
import HeroPanel from "./panels/HeroPanel";
import ListingsPanel from "./panels/ListingsPanel";
import StatsPanel from "./panels/StatsPanel";
import TestimonialsPanel from "./panels/TestimonialsPanel";
import BlogPanel from "./panels/BlogPanel";
import FaqPanel from "./panels/FaqPanel";
import CtaPanel from "./panels/CtaPanel";
import ServicesPanel from "./panels/ServicesPanel";
import GalleryPanel from "./panels/GalleryPanel";
import ContactPanel from "./panels/ContactPanel";
import RichTextPanel from "./panels/RichTextPanel";
import GenericPanel from "./panels/GenericPanel";
import { Settings2, Eye, EyeOff } from "lucide-react";
import { SECTION_META } from "@/lib/types/page-builder";

interface Props {
  section: PageSection | null;
  onUpdate: (props: Record<string, unknown>) => void;
  onUpdateMeta: (meta: Partial<Pick<PageSection, "label" | "isVisible">>) => void;
}

export default function PropertiesPanel({ section, onUpdate, onUpdateMeta }: Props) {
  if (!section) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Settings2 size={40} className="text-white/10 mb-3" />
        <p className="text-white/30 text-sm">Sélectionnez une section<br />pour modifier ses propriétés</p>
      </div>
    );
  }

  const meta = SECTION_META[section.type];

  const PanelMap: Record<string, React.FC<{ props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }>> = {
    hero: HeroPanel,
    listings: ListingsPanel,
    stats: StatsPanel,
    testimonials: TestimonialsPanel,
    blog: BlogPanel,
    faq: FaqPanel,
    cta: CtaPanel,
    promotions: GenericPanel,
    services: ServicesPanel,
    gallery: GalleryPanel,
    contact: ContactPanel,
    richtext: RichTextPanel,
    search: GenericPanel,
  };

  const Panel = PanelMap[section.type] ?? GenericPanel;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">{meta.label}</p>
          <p className="text-white/30 text-xs mt-0.5">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Label edit */}
          <input
            value={section.label || ""}
            onChange={e => onUpdateMeta({ label: e.target.value })}
            placeholder={meta.label}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-nova-red/40 w-28"
          />
          {/* Visibility toggle */}
          <button
            onClick={() => onUpdateMeta({ isVisible: !section.isVisible })}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-white/20" />}
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Panel props={section.props} onChange={onUpdate} />
      </div>
    </div>
  );
}
