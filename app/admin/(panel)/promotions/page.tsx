"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Tag, Loader2, Save, X, Pencil, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Promo {
  id: string; title: string; subtitle?: string; description?: string;
  image?: string; link?: string; badge?: string; discount?: string;
  cta?: string; isActive: boolean; order: number; expiresAt?: string;
}

const EMPTY: Omit<Promo, "id"> = {
  title: "", subtitle: "", description: "", image: "", link: "", badge: "",
  discount: "", cta: "Voir l'offre", isActive: true, order: 0, expiresAt: "",
};

export default function PromotionsAdmin() {
  const [items, setItems] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Promo> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/promotions?all=true");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (p: Promo) => setEditing({ ...p });

  const handleSave = async () => {
    if (!editing || !editing.title?.trim()) return;
    setSaving(true);
    setError("");
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/promotions" : `/api/promotions/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editing, order: Number(editing.order) || 0 }),
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
    await fetch(`/api/promotions/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const toggleActive = async (p: Promo) => {
    await fetch(`/api/promotions/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    load();
  };

  const set = (key: string, value: any) => setEditing(e => e ? { ...e, [key]: value } : e);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Tag size={20} className="text-nova-red" /> Promotions</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} promotion{items.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={16} /> Nouvelle promotion
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-12 text-center">
          <Tag size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Aucune promotion. Créez-en une !</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm rounded-lg transition-colors">
            <Plus size={14} className="inline mr-1" /> Créer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden group">
              {p.image && (
                <div className="h-36 bg-white/5 relative overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  {p.badge && <span className="absolute top-2 left-2 bg-nova-red text-white text-xs font-bold px-2 py-0.5 rounded">{p.badge}</span>}
                  {p.discount && <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">-{p.discount}</span>}
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold text-sm">{p.title}</p>
                    {p.subtitle && <p className="text-white/40 text-xs mt-0.5">{p.subtitle}</p>}
                  </div>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                    {p.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                {p.expiresAt && <p className="text-white/30 text-xs">Expire: {new Date(p.expiresAt).toLocaleDateString("fr-FR")}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-colors">
                    <Pencil size={12} /> Modifier
                  </button>
                  <button onClick={() => toggleActive(p)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    {p.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
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
              <h2 className="text-white font-semibold">{editing.id ? "Modifier la promotion" : "Nouvelle promotion"}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}
              {[
                { key: "title", label: "Titre *", placeholder: "Offre spéciale été" },
                { key: "subtitle", label: "Sous-titre", placeholder: "Jusqu'au 31 août" },
                { key: "badge", label: "Badge", placeholder: "PROMO" },
                { key: "discount", label: "Réduction", placeholder: "20%" },
                { key: "cta", label: "Bouton CTA", placeholder: "Voir l'offre" },
                { key: "link", label: "Lien", placeholder: "/automobiles" },
                { key: "description", label: "Description", placeholder: "Description courte..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
                  <input type="text" value={(editing as any)[key] || ""} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Date d'expiration</label>
                <input type="date" value={editing.expiresAt ? editing.expiresAt.split("T")[0] : ""} onChange={e => set("expiresAt", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Ordre d'affichage</label>
                <input type="number" value={editing.order || 0} onChange={e => set("order", e.target.value)} min="0"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50 transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="promo-active" checked={!!editing.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 accent-nova-red" />
                <label htmlFor="promo-active" className="text-sm text-white/60">Activer cette promotion</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Image</label>
                <ImageUploader value={editing.image ? [editing.image] : []} onChange={urls => set("image", urls[0] || "")} maxFiles={1} label="" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-white/5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">Annuler</button>
              <button onClick={handleSave} disabled={saving || !editing.title?.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Supprimer cette promotion ?"
        message={`"${deleteTarget?.title}" sera définitivement supprimée.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
