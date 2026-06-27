"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon, Upload, Trash2, Copy, RefreshCw,
  Search, Grid, List as ListIcon, Calendar, HardDrive, FileText, Check, ArrowRight
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

function fmt(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

function fmtDate(dStr: string) {
  return new Date(dStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function MediasPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "image" | "video" | "document">("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ limit: "100", ...(typeFilter ? { type: typeFilter } : {}), ...(search ? { search } : {}) });
      const res = await fetch(`/api/media?${q}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.media || [];
        setMedia(list);
        
        // Refresh selected item details if it's still in the list
        if (selectedItem) {
          const fresh = list.find((item: MediaItem) => item.id === selectedItem.id);
          if (fresh) setSelectedItem(fresh);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedItem]);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        await fetch("/api/upload", { method: "POST", body: fd });
      } catch (err) {
        console.error(err);
      }
    }
    setUploading(false);
    load();
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItem) return;
    setReplacing(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch(`/api/media/${selectedItem.id}`, {
        method: "PUT",
        body: fd,
      });
      if (res.ok) {
        // Reload settings and update selected item details
        await load();
      } else {
        const err = await res.json();
        alert(err.error || "Erreur de remplacement");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReplacing(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedItem?.id === deleteTarget.id) setSelectedItem(null);
        setDeleteTarget(null);
        load();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-gray-950 text-xl font-bold flex items-center gap-2">
            <ImageIcon size={20} className="text-nova-red" /> Bibliothèque de Médias
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Gérez, téléversez et remplacez toutes les images de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} />
          </button>
          
          {/* Layout view modes toggles */}
          <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ListIcon size={15} />
            </button>
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-nova-red/10">
            <Upload size={15} /> {uploading ? "Importation..." : "Importer"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {/* Grid container with details sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left main: media view */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar filter */}
          <div className="relative bg-white rounded-xl border border-gray-200 p-3 flex items-center shadow-sm">
            <Search className="absolute left-6 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une image par son nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-nova-red/30 transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-2xl">
              <div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
              <ImageIcon size={44} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Aucun fichier trouvé</p>
              <p className="text-gray-400 text-xs mt-1">Uploadez de nouveaux médias en cliquant sur "Importer" ci-dessus.</p>
            </div>
          ) : viewMode === "grid" ? (
            
            /* GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((m) => {
                const isSelected = selectedItem?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedItem(m)}
                    className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? "border-nova-red ring-4 ring-nova-red/10"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-square relative bg-gray-50">
                      <Image
                        src={m.url}
                        alt={m.filename}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized={m.url.startsWith("/")}
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-2.5 bg-white border-t border-gray-100">
                      <p className="text-gray-800 font-medium text-xs truncate" title={m.filename}>
                        {m.filename}
                      </p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{fmt(m.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            
            /* LIST VIEW */
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Visuel</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Nom du fichier</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Taille</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type MIME</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date d'import</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const isSelected = selectedItem?.id === m.id;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedItem(m)}
                        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-nova-red/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="w-10 h-10 rounded-lg relative overflow-hidden bg-gray-100 border border-gray-200">
                            <Image
                              src={m.url}
                              alt={m.filename}
                              fill
                              className="object-cover"
                              unoptimized={m.url.startsWith("/")}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800 text-xs max-w-xs truncate">
                          {m.filename}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{fmt(m.size)}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{m.mimetype || "—"}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{fmtDate(m.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right side: details and actions sidebar */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6 shadow-sm animate-in slide-in-from-right-4 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-gray-900 font-bold text-sm">Détails du média</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                >
                  Fermer
                </button>
              </div>

              {/* Visual preview */}
              <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.filename}
                  fill
                  className="object-contain"
                  unoptimized={selectedItem.url.startsWith("/")}
                />
              </div>

              {/* Data descriptors list */}
              <div className="space-y-3.5 text-xs border-b border-gray-100 pb-4">
                <div>
                  <span className="text-gray-400 block mb-0.5">Nom du fichier</span>
                  <span className="text-gray-800 font-semibold break-all">{selectedItem.filename}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Taille</span>
                    <span className="text-gray-800 font-semibold flex items-center gap-1.5">
                      <HardDrive size={13} className="text-gray-300" /> {fmt(selectedItem.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Format</span>
                    <span className="text-gray-800 font-semibold flex items-center gap-1.5">
                      <FileText size={13} className="text-gray-300" /> {selectedItem.mimetype?.split("/")[1]?.toUpperCase() || "—"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Date d'importation</span>
                  <span className="text-gray-800 font-semibold flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-300" /> {fmtDate(selectedItem.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Lien relatif</span>
                  <span className="text-gray-500 font-mono text-[10px] break-all bg-gray-55 px-2 py-1 rounded border border-gray-100 block mt-1">
                    {selectedItem.url}
                  </span>
                </div>
              </div>

              {/* Rich actions buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => copyUrl(selectedItem.url)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <Copy size={13} className={copied === selectedItem.url ? "text-emerald-500 animate-pulse" : ""} />
                  {copied === selectedItem.url ? "URL Copiée !" : "Copier l'URL complète"}
                </button>

                <button
                  onClick={() => replaceInputRef.current?.click()}
                  disabled={replacing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {replacing ? (
                    <RefreshCw size={13} className="animate-spin text-nova-red" />
                  ) : (
                    <RefreshCw size={13} />
                  )}
                  {replacing ? "Remplacement..." : "Remplacer l'image"}
                </button>

                <button
                  onClick={() => setDeleteTarget(selectedItem)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                >
                  <Trash2 size={13} /> Supprimer le média
                </button>
              </div>

              {/* Hidden file input for Replace action */}
              <input
                type="file"
                ref={replaceInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleReplaceFile}
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-xs shadow-sm sticky top-6">
              <ImageIcon size={28} className="text-gray-200 mx-auto mb-2 animate-bounce" />
              Sélectionnez un média pour en afficher les propriétés et les actions avancées.
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer définitivement ce média ?"
        message={`"${deleteTarget?.filename}" sera effacé du serveur et de la base de données. Tous les contenus utilisant cette image afficheront une erreur ou un fallback.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
