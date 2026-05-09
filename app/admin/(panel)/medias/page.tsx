"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Copy, RefreshCw } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface MediaItem { id: string; url: string; filename: string; mimetype: string; size: number; createdAt: string; }

function fmt(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function MediasPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/upload", { method: "POST", body: fd });
    }
    setUploading(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/media/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><ImageIcon size={20} className="text-blue-400" /> Médiathèque</h1>
          <p className="text-white/40 text-sm mt-0.5">{media.length} fichier{media.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-nova-red/20">
            <Upload size={16} /> {uploading ? "Upload..." : "Importer"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>
      ) : media.length === 0 ? (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-16 text-center">
          <ImageIcon size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30">Aucun média. Importez des images ci-dessus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {media.map((m) => (
            <div key={m.id} className="group relative bg-[#111827] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
              <div className="aspect-square relative bg-white/[0.02]">
                {m.mimetype?.startsWith("image/") ? (
                  <Image src={m.url} alt={m.filename} fill className="object-cover" unoptimized={m.url.startsWith("/")} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-white/20" />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(m.url)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors" title="Copier l'URL">
                    <Copy size={14} className={copied === m.url ? "text-emerald-400" : ""} />
                  </button>
                  <button onClick={() => setDeleteTarget(m)} className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-white/60 text-[10px] truncate">{m.filename}</p>
                <p className="text-white/20 text-[10px]">{m.size ? fmt(m.size) : "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Supprimer ce fichier ?" message={`"${deleteTarget?.filename}" sera définitivement supprimé.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
