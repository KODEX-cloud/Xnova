"use client";

import { useEffect, useState, useCallback } from "react";
import { HelpCircle, Plus, Trash2, Save, ChevronUp, ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const EMPTY_FORM = { question: "", answer: "", category: "Général" };

export default function FaqAdminPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["Général"]);
  const [newCategory, setNewCategory] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/faq/admin").catch(() => null);
    if (r?.ok) {
      const data: FaqItem[] = await r.json();
      setItems(data);
      const cats = [...new Set(data.map((d) => d.category || "Général"))];
      setCategories(cats.length ? cats : ["Général"]);
    } else {
      // Fallback: use public endpoint
      const r2 = await fetch("/api/faq").catch(() => null);
      if (r2?.ok) {
        const data: FaqItem[] = await r2.json();
        setItems(data);
        const cats = [...new Set(data.map((d) => d.category || "Général"))];
        setCategories(cats.length ? cats : ["Général"]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/faq/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: items.filter(i => i.category === form.category).length }),
      });
    }
    setForm(EMPTY_FORM);
    setSaving(false);
    load();
  };

  const toggle = async (item: FaqItem) => {
    await fetch(`/api/faq/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
  };

  const move = async (item: FaqItem, dir: "up" | "down") => {
    const cat = items.filter(i => i.category === item.category).sort((a, b) => a.order - b.order);
    const idx = cat.findIndex(i => i.id === item.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cat.length) return;
    const swap = cat[swapIdx];
    await Promise.all([
      fetch(`/api/faq/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: swap.order }) }),
      fetch(`/api/faq/${swap.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: item.order }) }),
    ]);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/faq/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  const startEdit = (item: FaqItem) => {
    setEditId(item.id);
    setForm({ question: item.question, answer: item.answer, category: item.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <HelpCircle size={20} className="text-nova-red" /> FAQ
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} question{items.length !== 1 ? "s" : ""} · {Object.keys(grouped).length} catégorie{Object.keys(grouped).length !== 1 ? "s" : ""}</p>
        </div>
        <a href="/faq" target="_blank" className="text-white/40 hover:text-white text-xs transition-colors">
          Voir la page →
        </a>
      </div>

      {/* Form */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm">{editId ? "Modifier la question" : "Ajouter une question"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-white/50 text-xs mb-1 block">Question *</label>
            <input
              value={form.question}
              onChange={(e) => setForm(p => ({ ...p, question: e.target.value }))}
              placeholder="Ex : Comment publier une annonce ?"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-white/50 text-xs mb-1 block">Réponse *</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm(p => ({ ...p, answer: e.target.value }))}
              rows={4}
              placeholder="Répondez à la question de manière claire et concise..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Nouvelle catégorie</label>
            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex : Paiement"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCategory.trim()) {
                    setCategories(p => [...new Set([...p, newCategory.trim()])]);
                    setForm(f => ({ ...f, category: newCategory.trim() }));
                    setNewCategory("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!newCategory.trim()) return;
                  setCategories(p => [...new Set([...p, newCategory.trim()])]);
                  setForm(f => ({ ...f, category: newCategory.trim() }));
                  setNewCategory("");
                }}
                className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving || !form.question.trim() || !form.answer.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {editId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editId && (
            <button
              onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}
              className="px-4 py-2.5 border border-white/10 text-white/50 text-sm rounded-lg hover:text-white hover:border-white/30 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-8 text-center">
          <HelpCircle size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Aucune question. Ajoutez-en une ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <p className="text-white/40 text-xs uppercase tracking-wider font-medium">{category} ({catItems.length})</p>
              </div>
              <div className="divide-y divide-white/5">
                {catItems.sort((a, b) => a.order - b.order).map((item, idx) => (
                  <div key={item.id} className={cn("px-4 py-3 group", !item.isActive && "opacity-50")}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-0.5 pt-1">
                        <button onClick={() => move(item, "up")} disabled={idx === 0} className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => move(item, "down")} disabled={idx === catItems.length - 1} className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-1 leading-snug">{item.question}</p>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{item.answer}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggle(item)} className={cn("w-7 h-7 flex items-center justify-center rounded transition-colors",
                          item.isActive ? "text-emerald-400 hover:bg-emerald-400/10" : "text-white/20 hover:bg-white/5")}>
                          {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={() => startEdit(item)} className="w-7 h-7 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                          <Save size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="w-7 h-7 flex items-center justify-center rounded text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer cette question ?"
        message={`"${deleteTarget?.question}" sera définitivement supprimée.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
