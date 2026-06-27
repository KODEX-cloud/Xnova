"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";

type P = { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void };

export default function GalleryPanel({ props, onChange }: P) {
  const [uploading, setUploading] = useState(false);
  const images = (props.images as string[]) || [];
  const columns = (props.columns as number) || 3;
  const heading = (props.heading as string) || "";

  const setImages = (imgs: string[]) => onChange({ ...props, images: imgs });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data.url);
      }
    }
    setImages([...images, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Titre (optionnel)</label>
        <input value={heading} onChange={e => onChange({ ...props, heading: e.target.value })}
          placeholder="Notre galerie"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Colonnes : {columns}</label>
        <input type="range" min={2} max={4} step={1} value={columns}
          onChange={e => onChange({ ...props, columns: +e.target.value })}
          className="w-full accent-nova-red" />
      </div>
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Images ({images.length})</p>
          <label className={`flex items-center gap-1.5 px-2.5 py-1 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-xs rounded-lg transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Plus size={12} /> {uploading ? "Envoi..." : "Ajouter"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {images.length === 0 ? (
          <div className="text-center py-8 text-white/20 text-xs border border-dashed border-white/10 rounded-lg">
            Aucune image
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-white/5">
                <Image src={src} alt={`Galerie ${i + 1}`} fill className="object-cover" sizes="120px" />
                <button
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
