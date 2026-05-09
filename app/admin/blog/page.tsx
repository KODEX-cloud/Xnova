"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, BookOpen, RefreshCw } from "lucide-react";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useRouter } from "next/navigation";

interface PostRow { id: string; title: string; category: string; status: string; views: number; author: string; createdAt: string; }

const S_COLORS: Record<string, string> = { PUBLISHED: "text-emerald-400 bg-emerald-400/10", DRAFT: "text-yellow-400 bg-yellow-400/10", ARCHIVED: "text-white/30 bg-white/5" };
const S_LABELS: Record<string, string> = { PUBLISHED: "Publié", DRAFT: "Brouillon", ARCHIVED: "Archivé" };

export default function BlogAdmin() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PostRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/blog?all=true&limit=200");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/blog/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const columns: Column<PostRow>[] = [
    {
      key: "title", label: "Article", sortable: true,
      render: (r) => (
        <div>
          <p className="text-white font-medium text-sm">{r.title}</p>
          <p className="text-white/30 text-xs">{r.category || "Sans catégorie"}</p>
        </div>
      ),
    },
    { key: "author", label: "Auteur", render: (r) => <span className="text-white/60">{r.author || "—"}</span> },
    {
      key: "status", label: "Statut",
      render: (r) => <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${S_COLORS[r.status]}`}>{S_LABELS[r.status]}</span>,
    },
    { key: "views", label: "Vues", sortable: true, render: (r) => <span className="text-white/50">{r.views.toLocaleString()}</span> },
    {
      key: "createdAt", label: "Date", sortable: true,
      render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><BookOpen size={20} className="text-blue-400" /> Blog & Conseils</h1>
          <p className="text-white/40 text-sm mt-0.5">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"><RefreshCw size={15} /></button>
          <Link href="/admin/blog/nouveau" className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={16} /> Nouvel article
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={posts} loading={loading} searchable searchKeys={["title", "category", "author"]}
        onEdit={(r) => router.push(`/admin/blog/${r.id}`)}
        onDelete={setDeleteTarget}
      />
      <ConfirmDialog open={!!deleteTarget} title="Supprimer cet article ?"
        message={`"${deleteTarget?.title}" sera définitivement supprimé.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
