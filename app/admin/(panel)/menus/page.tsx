"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Navigation, Plus, Trash2, GripVertical, Loader2, Eye, EyeOff } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

interface MenuItem { id: string; label: string; href: string; parentId: string | null; order: number; isActive: boolean; target?: string; }

function SortableRow({ item, onUpdate, onDelete }: { item: MenuItem; onUpdate: (i: MenuItem) => void; onDelete: (i: MenuItem) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [local, setLocal] = useState(item);
  const isDirty = local.label !== item.label || local.href !== item.href;

  return (
    <div ref={setNodeRef} style={style}
      className={cn("flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] group border-b border-white/5 last:border-0",
        isDragging ? "opacity-50 bg-white/5 z-50" : "")}>
      <button {...attributes} {...listeners} className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none">
        <GripVertical size={14} />
      </button>
      <input value={local.label} onChange={e => setLocal(l => ({ ...l, label: e.target.value }))}
        className="flex-1 bg-transparent text-white text-sm focus:outline-none hover:bg-white/5 focus:bg-white/5 px-2 py-1 rounded transition-colors" />
      <input value={local.href || ""} onChange={e => setLocal(l => ({ ...l, href: e.target.value }))}
        placeholder="/lien"
        className="w-36 bg-transparent text-white/40 text-sm font-mono focus:outline-none hover:bg-white/5 focus:bg-white/5 px-2 py-1 rounded transition-colors" />
      <button onClick={() => { const updated = { ...local, isActive: !local.isActive }; setLocal(updated); onUpdate(updated); }}
        className={cn("w-6 h-6 flex items-center justify-center rounded transition-colors flex-shrink-0",
          local.isActive ? "text-emerald-400 hover:bg-emerald-400/10" : "text-white/20 hover:bg-white/5")}
        title={local.isActive ? "Désactiver" : "Activer"}>
        {local.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
      {isDirty && (
        <button onClick={() => onUpdate(local)} className="text-emerald-400 text-xs px-2 py-1 bg-emerald-400/10 rounded hover:bg-emerald-400/20 transition-colors flex-shrink-0">
          ✓
        </button>
      )}
      <button onClick={() => onDelete(item)} className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ label: "", href: "", parentId: "" });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/menus");
    const data = await res.json();
    setItems(Array.isArray(data) ? data.sort((a: MenuItem, b: MenuItem) => a.order - b.order) : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const roots = items.filter(i => !i.parentId);
    const oldIndex = roots.findIndex(i => i.id === active.id);
    const newIndex = roots.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(roots, oldIndex, newIndex).map((item, idx) => ({ ...item, order: idx }));
    const others = items.filter(i => i.parentId);
    setItems([...reordered, ...others]);
    // Persist order
    setSaving(true);
    await Promise.all(reordered.map(item =>
      fetch(`/api/menus/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: item.order }) })
    ));
    setSaving(false);
  };

  const handleUpdate = async (item: MenuItem) => {
    setSaving(true);
    await fetch(`/api/menus/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
    setItems(prev => prev.map(i => i.id === item.id ? item : i));
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/menus/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.label) return;
    await fetch("/api/menus", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, parentId: newItem.parentId || null, order: items.filter(i => !i.parentId).length }) });
    setNewItem({ label: "", href: "", parentId: "" });
    load();
  };

  const roots = items.filter(i => !i.parentId);
  const childrenOf = (id: string) => items.filter(i => i.parentId === id);

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Navigation size={20} className="text-nova-red" /> Menus de navigation</h1>
          <p className="text-white/40 text-sm mt-0.5">Glissez-déposez pour réorganiser • Cliquez sur l'œil pour activer/désactiver</p>
        </div>
        {saving && <div className="flex items-center gap-2 text-white/40 text-sm"><Loader2 size={14} className="animate-spin" /> Sauvegarde...</div>}
      </div>

      {/* Add new item */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Ajouter un élément</h2>
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
          <input type="text" placeholder="Label *" value={newItem.label} onChange={e => setNewItem(n => ({ ...n, label: e.target.value }))} required
            className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50" />
          <input type="text" placeholder="/lien" value={newItem.href} onChange={e => setNewItem(n => ({ ...n, href: e.target.value }))}
            className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-nova-red/50" />
          <select value={newItem.parentId} onChange={e => setNewItem(n => ({ ...n, parentId: e.target.value }))}
            className="bg-[#1F2937] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nova-red/50">
            <option value="">Menu principal</option>
            {roots.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={15} /> Ajouter
          </button>
        </form>
      </div>

      {/* Menu items with DND */}
      <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Navigation ({items.length} éléments)</p>
          <span className="text-white/20 text-xs">• glissez pour réordonner</span>
        </div>
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-nova-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">Aucun élément. Ajoutez-en un ci-dessus.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={roots.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {roots.map(item => (
                <div key={item.id}>
                  <SortableRow item={item} onUpdate={handleUpdate} onDelete={setDeleteTarget} />
                  {childrenOf(item.id).map(child => (
                    <div key={child.id} className="pl-8 bg-white/[0.01]">
                      <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] group border-b border-white/[0.03]">
                        <span className="text-white/20 text-xs flex-shrink-0">↳</span>
                        <input value={child.label} onChange={e => handleUpdate({ ...child, label: e.target.value })}
                          className="flex-1 bg-transparent text-white/70 text-sm focus:outline-none px-2 py-1" />
                        <input value={child.href || ""} onChange={e => handleUpdate({ ...child, href: e.target.value })}
                          className="w-36 bg-transparent text-white/30 text-sm font-mono focus:outline-none px-2 py-1" />
                        <button onClick={() => setDeleteTarget(child)} className="w-6 h-6 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Supprimer cet élément ?"
        message={`"${deleteTarget?.label}" sera supprimé du menu.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
