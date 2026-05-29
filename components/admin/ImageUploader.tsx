"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import MediaLibraryModal from "./MediaLibraryModal";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
}

export default function ImageUploader({
  value = [],
  onChange,
  maxFiles = 10,
  label = "Images",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const upload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.url) newUrls.push(data.url);
        } catch (e) {
          console.error("Upload failed:", e);
        }
      }

      onChange([...value, ...newUrls].slice(0, maxFiles));
      setUploading(false);
    },
    [value, onChange, maxFiles]
  );

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      upload(e.dataTransfer.files);
    },
    [upload]
  );

  const handleLibrarySelect = (urls: string[]) => {
    onChange([...value, ...urls].slice(0, maxFiles));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-white/60">{label}</label>
        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="text-xs text-nova-red font-bold hover:underline flex items-center gap-1 transition-colors"
          >
            <ImageIcon size={13} /> Bibliothèque
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
          dragOver ? "border-nova-red bg-nova-red/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
        )}
        onClick={() => document.getElementById("image-input")?.click()}
      >
        <input
          id="image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-nova-red animate-spin" />
            <p className="text-white/40 text-sm">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-white/30" />
            <p className="text-white/50 text-sm">
              Glissez des images ici ou <span className="text-nova-red">cliquez pour choisir</span>
            </p>
            <p className="text-white/25 text-xs">PNG, JPG, WebP — max {maxFiles} images</p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-white/5">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={url.startsWith("/")}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(url); }}
                  className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-nova-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
          {value.length < maxFiles && (
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="aspect-square rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-white/40 hover:border-white/20 transition-colors"
            >
              <ImageIcon size={20} />
            </button>
          )}
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        multiple={maxFiles > 1}
        maxFiles={maxFiles - value.length}
      />
    </div>
  );
}

