"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { Plus, Save, Eye, Loader2, Check, LayoutTemplate } from "lucide-react";
import { PageSection, SECTION_DEFAULTS } from "@/lib/types/page-builder";
import SectionCard from "./SectionCard";
import AddSectionModal from "./AddSectionModal";
import PropertiesPanel from "./PropertiesPanel";

interface Props {
  pageSlug: string;
  pageTitle: string;
  initialSections: PageSection[];
}

export default function PageBuilder({ pageSlug, pageTitle, initialSections }: Props) {
  const [sections, setSections] = useState<PageSection[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSections.length > 0 ? initialSections[0].id : null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedSection = sections.find(s => s.id === selectedId) ?? null;

  // ── Drag end ──────────────────────────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSections(prev => {
      const oldIndex = prev.findIndex(s => s.id === active.id);
      const newIndex = prev.findIndex(s => s.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((s, i) => ({ ...s, order: i }));
    });
  };

  // ── Section ops ───────────────────────────────────────────────────────────
  const addSection = useCallback((section: PageSection) => {
    const newSection: PageSection = { ...section, order: sections.length };
    setSections(prev => [...prev, newSection]);
    setSelectedId(newSection.id);
    setShowAddModal(false);
  }, [sections.length]);

  const updateSection = useCallback((id: string, updates: Partial<PageSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, i) => ({ ...s, order: i }));
    });
    setSelectedId(prev => prev === id ? null : prev);
  }, []);

  const duplicateSection = useCallback((id: string) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const original = prev[idx];
      const clone: PageSection = {
        ...original,
        id: uuidv4(),
        label: original.label ? `${original.label} (copie)` : undefined,
        order: idx + 1,
        props: { ...original.props },
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageSlug}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel: section list ─────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#080D14]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={16} className="text-white/40" />
            <span className="text-sm font-medium text-white/70 truncate max-w-[130px]" title={pageTitle}>{pageTitle}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-xs rounded-lg transition-colors"
          >
            <Plus size={13} /> Section
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <LayoutTemplate size={32} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm">Page vide</p>
              <p className="text-white/20 text-xs mt-1">Cliquez sur "+ Section" pour commencer</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {sections.map(section => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    isSelected={selectedId === section.id}
                    onSelect={() => setSelectedId(section.id)}
                    onDelete={() => deleteSection(section.id)}
                    onDuplicate={() => duplicateSection(section.id)}
                    onToggleVisibility={() => updateSection(section.id, { isVisible: !section.isVisible })}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer: save */}
        <div className="px-3 py-3 border-t border-white/5">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              saved ? "bg-green-500/20 text-green-400 border border-green-500/30" :
              "bg-nova-red hover:bg-nova-red/90 text-white"
            }`}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> :
             saved ? <Check size={15} /> :
             <Save size={15} />}
            {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder"}
          </button>
          <a
            href={pageSlug === "home" ? "/" : `/${pageSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 border border-white/5 hover:border-white/10 transition-colors"
          >
            <Eye size={13} /> Voir la page
          </a>
        </div>
      </div>

      {/* ── Right panel: properties ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[#0A0F1C]">
        {selectedSection ? (
          <PropertiesPanel
            section={selectedSection}
            onUpdate={(newProps) => updateSection(selectedSection.id, { props: newProps })}
            onUpdateMeta={(meta) => updateSection(selectedSection.id, meta)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-4">
              <LayoutTemplate size={28} className="text-white/15" />
            </div>
            <p className="text-white/30 text-sm">Sélectionnez une section</p>
            <p className="text-white/20 text-xs mt-1">Cliquez sur une section dans la liste pour l'éditer</p>
          </div>
        )}
      </div>

      {/* Add section modal */}
      {showAddModal && (
        <AddSectionModal
          onAdd={addSection}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
