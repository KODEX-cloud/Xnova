"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Star, Loader2, Save, X, Pencil, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Testimonial {
  id: string; name: string; role?: string; company?: string;
  avatar?: string; content: string; rating: number; isActive: boolean; order: number;
}

const EMPTY: Omit<Testimonial, "id"> = {
  name: "", role: "", company: "", avatar: "", content: "", rating: 5, isActive: true, order: 0,
};

function Stars({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)}
          className={`transition-colors ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}>
          <Star size={16} className={n <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"} />
        </button>
      ))}
    </div>
  );
}

export default function TemoignagesAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/testimonials?all=true");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (t: Testimonial) => setEditing({ ...t });

  const handleSave = async () => {
    if (!editing || !editing.name?.trim() || !editing.content?.trim()) return;
    setSaving(true);
    setError("");
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/testimonials" : `/api/testimonials/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, rating: Number(editing.rating) || 5, order: Number(editing.order) || 0 }),
    });
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      setError((await res.json()).error || "Erreur");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/testimonials/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    load();
  };

  const set = (key: string, value: any) => setEditing(e => e ? { ...e, [key]: value } : e);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Star size={20} className="text-yellow-400" /> Témoignages</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} témoignage{items.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={16} /> Nouveau témoignage
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-12 text-center">
          <Star size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Aucun témoignage. Ajoutez-en un !</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm rounded-lg transition-colors">
            <Plus size={14} className="inline mr-1" /> Ajouter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t.id} className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-nova-red/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-nova-red font-bold text-sm">{t.name[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-white/40 text-xs">{[t.role, t.company].filter(Boolean).join(" — ")}</p>
                  )}
                  <Stars rating={t.rating} />
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${t.isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                  {t.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              <p className="text-white/50 text-sm line-clamp-3 italic">"{t.content}"</p>
              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-colors">
                  <Pencil size={12} /> Modifier
                </button>
                <button onClick={() => toggleActive(t)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  {t.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => setDeleteTarget(t)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-white font-semibold">{editing.id ? "Modifier le témoignage" : "Nouveau témoignage"}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
              {[
                { key: "name", label: "Nom *", placeholder: "Jean Konan" },
                { key: "role", label: "Poste", placeholder: "Directeur commercial" },
                { key: "company", label: "Entreprise", placeholder: "SARL ABC" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
                  <input type="text" value={(editing as any)[key] || ""} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Contenu *</label>
                <textarea value={editing.content || ""} onChange={e => set("content", e.target.value)} rows={4}
                  placeholder="Ce que dit le client..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Note</label>
                <Stars rating={editing.rating ?? 5} onChange={r => set("rating", r)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Ordre d'affichage</label>
                <input type="number" value={editing.order ?? 0} onChange={e => set("order", e.target.value)} min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50 transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="testi-active" checked={!!editing.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 accent-nova-red" />
                <label htmlFor="testi-active" className="text-sm text-white/60">Afficher sur le site</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Photo (avatar)</label>
                <ImageUploader value={editing.avatar ? [editing.avatar] : []} onChange={urls => set("avatar", urls[0] || "")} maxFiles={1} label="" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={saving || !editing.name?.trim() || !editing.content?.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Supprimer ce témoignage ?"
        message={`Le témoignage de "${deleteTarget?.name}" sera définitivement supprimé.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
