"use client";

import { X } from "lucide-react";
import { SectionType, SECTION_META, SECTION_DEFAULTS } from "@/lib/types/page-builder";
import * as LucideIcons from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onAdd: (section: { id: string; type: SectionType; order: number; isVisible: boolean; props: Record<string, unknown> }) => void;
  onClose: () => void;
}

const TYPES: SectionType[] = ["hero", "listings", "stats", "testimonials", "blog", "faq", "cta", "promotions", "services", "gallery", "contact", "richtext"];

export default function AddSectionModal({ onAdd, onClose }: Props) {
  const handleAdd = (type: SectionType) => {
    onAdd({ id: uuidv4(), type, order: 0, isVisible: true, props: { ...SECTION_DEFAULTS[type] } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0D1117] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h3 className="text-white font-semibold">Ajouter une section</h3>
            <p className="text-white/40 text-xs mt-0.5">Choisissez un type de section à insérer dans la page</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6">
          {TYPES.map(type => {
            const meta = SECTION_META[type];
            const IconComp = (LucideIcons as any)[meta.icon] as React.FC<{ size?: number; className?: string }>;
            return (
              <button
                key={type}
                onClick={() => handleAdd(type)}
                className="flex flex-col items-start gap-2 p-4 bg-white/3 hover:bg-nova-red/10 border border-white/5 hover:border-nova-red/30 rounded-xl transition-all group text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-nova-red/20 flex items-center justify-center transition-colors">
                  {IconComp && <IconComp size={16} className="text-white/50 group-hover:text-nova-red transition-colors" />}
                </div>
                <div>
                  <p className="text-white/80 group-hover:text-white text-sm font-medium transition-colors">{meta.label}</p>
                  <p className="text-white/30 text-xs mt-0.5 leading-tight">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
