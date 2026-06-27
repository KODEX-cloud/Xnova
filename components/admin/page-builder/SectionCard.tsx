"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Edit2, Trash2, Copy } from "lucide-react";
import { PageSection, SECTION_META } from "@/lib/types/page-builder";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface Props {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
}

export default function SectionCard({ section, isSelected, onSelect, onDelete, onDuplicate, onToggleVisibility }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const meta = SECTION_META[section.type];
  const IconComp = (LucideIcons as any)[meta.icon] as React.FC<{ size?: number; className?: string }>;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all",
        isDragging ? "opacity-50 bg-white/10 border-white/20 z-50" : "bg-[#111827] border-white/5",
        isSelected ? "border-nova-red/50 bg-nova-red/5" : "hover:border-white/10"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
      >
        <GripVertical size={16} />
      </button>

      {/* Icon + info */}
      <div
        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
        onClick={onSelect}
      >
        <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0",
          isSelected ? "bg-nova-red/20" : "bg-white/5")}>
          {IconComp && <IconComp size={14} className={isSelected ? "text-nova-red" : "text-white/40"} />}
        </div>
        <div className="min-w-0">
          <p className={cn("text-sm font-medium truncate", isSelected ? "text-white" : "text-white/70")}>
            {section.label || meta.label}
          </p>
          <p className="text-white/25 text-xs truncate">{meta.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleVisibility}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
          title={section.isVisible ? "Masquer" : "Afficher"}
        >
          {section.isVisible ? <Eye size={13} /> : <EyeOff size={13} className="text-white/20" />}
        </button>
        <button
          onClick={onDuplicate}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
          title="Dupliquer"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={onSelect}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-nova-red hover:bg-nova-red/10 transition-colors"
          title="Éditer"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
