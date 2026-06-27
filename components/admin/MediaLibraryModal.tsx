"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, Search, Upload, Loader2, Image as ImageIcon, Check } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

function fmt(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  multiple = false,
  maxFiles = 10,
}: MediaLibraryModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media?limit=100");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      load();
      setSelected([]);
    }
  }, [open, load]);

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

  const toggleSelect = (url: string) => {
    if (multiple) {
      if (selected.includes(url)) {
        setSelected(selected.filter((u) => u !== url));
      } else {
        if (selected.length < maxFiles) {
          setSelected([...selected, url]);
        }
      }
    } else {
      setSelected([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  if (!open) return null;

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
              <ImageIcon size={20} className="text-nova-red" /> Sélectionner depuis la bibliothèque
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Choisissez des images déjà téléversées ou ajoutez-en de nouvelles
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-55">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Rechercher une image..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-gray-800 text-sm focus:outline-none focus:border-nova-red/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">
              <Upload size={14} /> {uploading ? "Importation..." : "Uploader"}
              <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleUpload} />
            </label>
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-nova-red hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40"
            >
              Insérer {selected.length > 0 && `(${selected.length})`}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="animate-spin text-nova-red" size={24} />
              <p className="text-gray-400 text-xs">Chargement de la bibliothèque...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-gray-200 rounded-xl p-12 bg-white">
              <ImageIcon size={36} className="text-gray-300 mb-3 animate-pulse" />
              <p className="text-gray-500 font-medium text-sm">Aucun média trouvé</p>
              <p className="text-gray-400 text-xs mt-1">Uploadez une image à l'aide du bouton ci-dessus.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filtered.map((m) => {
                const isSelected = selected.includes(m.url);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleSelect(m.url)}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-white ${
                      isSelected
                        ? "border-nova-red ring-4 ring-nova-red/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={m.url}
                      alt={m.filename}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized={m.url.startsWith("/")}
                    />
                    
                    {/* Hover Selection Info Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? "bg-nova-red text-white" : "bg-white/80 text-gray-500 hover:bg-white"
                        }`}>
                          <Check size={12} className={isSelected ? "opacity-100" : "opacity-0"} />
                        </div>
                      </div>
                      <div className="bg-black/60 p-1.5 rounded-lg text-[9px] text-white truncate">
                        {m.filename}
                      </div>
                    </div>

                    {/* Pre-selected Indicator when hover is off */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-nova-red text-white flex items-center justify-center shadow-md">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
