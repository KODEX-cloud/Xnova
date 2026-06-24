"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Navigation, Plus, Trash2, GripVertical, Loader2, Eye, EyeOff,
  Save, RotateCcw, AlertCircle, CheckCircle, Layers,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

type Tab = "navigation" | "megamenu";

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

const MEGA_DEFAULT_HINT = `// Structure du mega menu — Modifiez les valeurs, pas les clés.
// iconName: nom d'une icône Lucide (CarFront, Building2, Key, Layers, Settings, Home, MapPin, BookOpen, Info...)
// Supprimez subMenus pour un lien simple.
`;

export default function MenusPage() {
  const [tab, setTab] = useState<Tab>("navigation");

  // Navigation tab
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ label: "", href: "", parentId: "" });

  // Mega menu tab
  const [megaJson, setMegaJson] = useState("");
  const [mobileJson, setMobileJson] = useState("");
  const [megaValid, setMegaValid] = useState(true);
  const [mobileValid, setMobileValid] = useState(true);
  const [megaSaving, setMegaSaving] = useState(false);
  const [megaSaved, setMegaSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/menus");
    const data = await res.json();
    setItems(Array.isArray(data) ? data.sort((a: MenuItem, b: MenuItem) => a.order - b.order) : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab === "megamenu") {
      fetch("/api/settings?prefix=nav.")
        .then(r => r.json())
        .then((data: Record<string, string>) => {
          if (data["megamenu"]) setMegaJson(data["megamenu"]);
          if (data["mobilemenu"]) setMobileJson(data["mobilemenu"]);
        })
        .catch(() => {});
    }
  }, [tab]);

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

  const validateJson = (value: string, setter: (v: boolean) => void): boolean => {
    if (!value.trim()) { setter(true); return true; }
    try { JSON.parse(value); setter(true); return true; }
    catch { setter(false); return false; }
  };

  const saveMegaMenu = async () => {
    const megaOk = validateJson(megaJson, setMegaValid);
    const mobileOk = validateJson(mobileJson, setMobileValid);
    if (!megaOk || !mobileOk) return;
    setMegaSaving(true);
    const payload: Record<string, string> = {};
    if (megaJson.trim()) payload["nav.megamenu"] = megaJson.trim();
    if (mobileJson.trim()) payload["nav.mobilemenu"] = mobileJson.trim();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMegaSaving(false);
    setMegaSaved(true);
    setTimeout(() => setMegaSaved(false), 2500);
  };

  const resetMegaMenu = () => {
    setMegaJson("");
    setMobileJson("");
    setMegaValid(true);
    setMobileValid(true);
  };

  const roots = items.filter(i => !i.parentId);
  const childrenOf = (id: string) => items.filter(i => i.parentId === id);

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Navigation size={20} className="text-nova-red" /> Menus de navigation
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Navigation simple et mega menu de la Navbar</p>
        </div>
        {saving && <div className="flex items-center gap-2 text-white/40 text-sm"><Loader2 size={14} className="animate-spin" /> Sauvegarde...</div>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("navigation")}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "navigation" ? "bg-nova-red text-white" : "text-white/50 hover:text-white")}>
          <Navigation size={15} /> Navigation simple
        </button>
        <button onClick={() => setTab("megamenu")}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "megamenu" ? "bg-nova-red text-white" : "text-white/50 hover:text-white")}>
          <Layers size={15} /> Mega Menu
        </button>
      </div>

      {/* ── NAVIGATION TAB ── */}
      {tab === "navigation" && (
        <>
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
        </>
      )}

      {/* ── MEGA MENU TAB ── */}
      {tab === "megamenu" && (
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-white/40 text-xs space-y-1">
            <p className="text-white/60 font-semibold text-sm mb-2">Comment ça marche ?</p>
            <p>• Collez ici le JSON de votre mega menu. La Navbar le chargera automatiquement.</p>
            <p>• <code className="text-nova-orange">iconName</code> : nom d'une icône Lucide (CarFront, Building2, Key, Layers, Settings, Home, MapPin, BookOpen, Info...)</p>
            <p>• Si le champ est vide, le mega menu par défaut est utilisé (hardcodé dans lib/nav-defaults.ts).</p>
            <p>• Pour un lien simple sans sous-menu, utilisez <code className="text-nova-orange">&quot;link&quot;: &quot;/chemin&quot;</code> au lieu de <code className="text-nova-orange">subMenus</code>.</p>
          </div>

          {/* Mega menu JSON */}
          <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <p className="text-white/60 text-sm font-semibold">Menu principal (JSON)</p>
              {!megaValid && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle size={13} /> JSON invalide
                </div>
              )}
              {megaValid && megaJson && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <CheckCircle size={13} /> JSON valide
                </div>
              )}
            </div>
            <textarea
              value={megaJson}
              onChange={(e) => { setMegaJson(e.target.value); validateJson(e.target.value, setMegaValid); }}
              rows={16}
              placeholder={`[\n  { "id": 0, "label": "Accueil", "link": "/" },\n  {\n    "id": 1,\n    "label": "Automobile",\n    "subMenus": [\n      {\n        "title": "Véhicules",\n        "items": [\n          { "label": "Vente", "description": "...", "iconName": "CarFront", "href": "/automobile/vente" }\n        ]\n      }\n    ]\n  }\n]`}
              className={cn(
                "w-full bg-transparent text-white/70 text-xs font-mono p-4 focus:outline-none resize-y min-h-[300px]",
                !megaValid && megaJson ? "text-red-300" : ""
              )}
            />
          </div>

          {/* Mobile nav JSON */}
          <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <p className="text-white/60 text-sm font-semibold">Navigation mobile (JSON simplifié)</p>
              {!mobileValid && <div className="flex items-center gap-1.5 text-red-400 text-xs"><AlertCircle size={13} /> JSON invalide</div>}
            </div>
            <textarea
              value={mobileJson}
              onChange={(e) => { setMobileJson(e.target.value); validateJson(e.target.value, setMobileValid); }}
              rows={8}
              placeholder={`[\n  { "label": "Accueil", "href": "/", "iconName": "Home" },\n  { "label": "Voitures à vendre", "href": "/automobile/vente", "iconName": "CarFront" }\n]`}
              className={cn(
                "w-full bg-transparent text-white/70 text-xs font-mono p-4 focus:outline-none resize-y min-h-[180px]",
                !mobileValid && mobileJson ? "text-red-300" : ""
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveMegaMenu}
              disabled={megaSaving || !megaValid || !mobileValid}
              className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {megaSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {megaSaved ? "Enregistré ✓" : "Enregistrer le mega menu"}
            </button>
            <button onClick={resetMegaMenu} className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/50 text-sm rounded-lg hover:text-white hover:border-white/30 transition-colors">
              <RotateCcw size={15} /> Vider (utiliser les défauts)
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Supprimer cet élément ?"
        message={`"${deleteTarget?.label}" sera supprimé du menu.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
