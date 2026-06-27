"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import ImageUploader from "./ImageUploader";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false, loading: () => (
  <div className="h-64 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
    <Loader2 className="animate-spin text-white/30" size={24} />
  </div>
) });

interface BlogData {
  title: string; category: string; excerpt: string; content: string;
  coverImage: string; author: string; readTime: number | string;
  status: string; tags: string; seoTitle: string; metaDescription: string;
}

const INIT: BlogData = {
  title: "", category: "Automobile", excerpt: "", content: "",
  coverImage: "", author: "Équipe NOVA", readTime: 5,
  status: "DRAFT", tags: "", seoTitle: "", metaDescription: "",
};

const CATEGORIES = ["Automobile", "Immobilier", "Conseils", "Actualité", "Guide d'achat", "Tendances"];

export default function BlogForm({ initialData, postId }: { initialData?: Partial<BlogData>; postId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<BlogData>({ ...INIT, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof BlogData, value: any) => setData(d => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(postId ? `/api/blog/${postId}` : "/api/blog", {
      method: postId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        readTime: Number(data.readTime),
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      }),
    });

    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError((await res.json()).error || "Erreur");
      setSaving(false);
    }
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>{children}</div>
  );
  const Input = ({ field, ...props }: { field: keyof BlogData } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} value={String(data[field] ?? "")} onChange={e => set(field, e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => { set("status", "DRAFT"); setTimeout(() => { (document.querySelector("form") as HTMLFormElement)?.requestSubmit(); }, 50); }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm rounded-lg transition-colors">
            Enregistrer brouillon
          </button>
          <button type="submit" onClick={() => set("status", "PUBLISHED")} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {postId ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <F label="Titre de l'article *"><Input field="title" placeholder="Un titre percutant..." required /></F>
            <F label="Extrait (résumé court)">
              <textarea value={data.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors"
                placeholder="Bref résumé affiché dans les listes..." />
            </F>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Contenu</label>
              <RichTextEditor value={data.content} onChange={v => set("content", v)} placeholder="Rédigez votre article ici..." minHeight={350} />
            </div>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">SEO</h2>
            <F label="Titre SEO"><Input field="seoTitle" placeholder="Titre optimisé pour Google" /></F>
            <F label="Meta description">
              <textarea value={data.metaDescription} onChange={e => set("metaDescription", e.target.value)} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors" />
            </F>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Publication</h2>
            <F label="Statut">
              <select value={data.status} onChange={e => set("status", e.target.value)}
                className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50">
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </F>
            <F label="Catégorie">
              <select value={data.category} onChange={e => set("category", e.target.value)}
                className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </F>
            <F label="Auteur"><Input field="author" placeholder="Nom de l'auteur" /></F>
            <F label="Temps de lecture (min)"><Input field="readTime" type="number" min="1" /></F>
            <F label="Tags (séparés par virgule)"><Input field="tags" placeholder="voiture, achat, conseil" /></F>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <label className="block text-sm font-medium text-white/60 mb-2">Image de couverture</label>
            <ImageUploader
              value={data.coverImage ? [data.coverImage] : []}
              onChange={urls => set("coverImage", urls[0] || "")}
              maxFiles={1}
              label=""
            />
          </div>
        </div>
      </div>
    </form>
  );
}
