"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface PropertyFormData {
  title: string; type: string; price: number | string; priceType: string;
  bedrooms: number | string; bathrooms: number | string; surface: number | string;
  land: number | string; city: string; district: string; location: string;
  description: string; badge: string; status: string; featured: boolean;
  seoTitle: string; metaDescription: string; images: string[];
}

const INIT: PropertyFormData = {
  title: "", type: "VILLA", price: "", priceType: "SALE",
  bedrooms: "", bathrooms: "", surface: "", land: "",
  city: "Abidjan", district: "", location: "", description: "",
  badge: "", status: "ACTIVE", featured: false,
  seoTitle: "", metaDescription: "", images: [],
};

const TYPES = [
  { value: "VILLA", label: "Villa" }, { value: "HOUSE", label: "Maison" },
  { value: "APARTMENT", label: "Appartement" }, { value: "LAND", label: "Terrain" },
  { value: "STUDIO", label: "Studio meublé" }, { value: "OFFICE", label: "Bureau" },
];
const CITIES = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Treichville", "Adjamé", "Koumassi", "Port-Bouët", "San-Pédro", "Bouaké"];

export default function PropertyForm({ initialData, propId }: { initialData?: Partial<PropertyFormData>; propId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PropertyFormData>({ ...INIT, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof PropertyFormData, value: any) => setData((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(propId ? `/api/properties/${propId}` : "/api/properties", {
      method: propId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        price: Number(data.price),
        bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        surface: data.surface ? Number(data.surface) : null,
        land: data.land ? Number(data.land) : null,
      }),
    });

    if (res.ok) {
      router.push("/admin/immobilier");
      router.refresh();
    } else {
      setError((await res.json()).error || "Erreur");
      setSaving(false);
    }
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
  const Input = ({ field, ...props }: { field: keyof PropertyFormData } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} value={String(data[field] ?? "")} onChange={(e) => set(field, e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors" />
  );
  const Select = ({ field, options }: { field: keyof PropertyFormData; options: { value: string; label: string }[] }) => (
    <select value={String(data[field] ?? "")} onChange={(e) => set(field, e.target.value)}
      className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50 transition-colors">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-orange hover:bg-nova-orange/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {propId ? "Mettre à jour" : "Créer l'annonce"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Informations du bien</h2>
            <F label="Titre de l'annonce *"><Input field="title" placeholder="Ex: Villa 4 chambres à Cocody" required /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Type de bien"><Select field="type" options={TYPES} /></F>
              <F label="Type d'annonce"><Select field="priceType" options={[{ value: "SALE", label: "Vente" }, { value: "RENT", label: "Location" }]} /></F>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <F label="Chambres"><Input field="bedrooms" type="number" min="0" placeholder="4" /></F>
              <F label="SdB"><Input field="bathrooms" type="number" min="0" placeholder="2" /></F>
              <F label="Surface (m²)"><Input field="surface" type="number" min="0" placeholder="250" /></F>
              <F label="Terrain (m²)"><Input field="land" type="number" min="0" placeholder="500" /></F>
            </div>
            <F label="Description">
              <textarea value={data.description} onChange={(e) => set("description", e.target.value)} rows={4}
                placeholder="Décrivez le bien en détail..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors" />
            </F>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">SEO</h2>
            <F label="Titre SEO"><Input field="seoTitle" placeholder="Titre optimisé pour Google" /></F>
            <F label="Meta description">
              <textarea value={data.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors" />
            </F>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Prix & Statut</h2>
            <F label="Prix (CFA) *"><Input field="price" type="number" min="0" required /></F>
            <F label="Statut"><Select field="status" options={[
              { value: "ACTIVE", label: "Disponible" }, { value: "SOLD", label: "Vendu" },
              { value: "RENTED", label: "Loué" }, { value: "PENDING", label: "En attente" }, { value: "INACTIVE", label: "Inactif" }
            ]} /></F>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="feat" checked={data.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-nova-red" />
              <label htmlFor="feat" className="text-sm text-white/60">Mettre en vedette</label>
            </div>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Localisation</h2>
            <F label="Ville"><Select field="city" options={CITIES.map(c => ({ value: c, label: c }))} /></F>
            <F label="Quartier"><Input field="district" placeholder="Ex: Angré, Riviera" /></F>
            <F label="Adresse"><Input field="location" placeholder="Ex: Rue des Jardins" /></F>
            <F label="Badge"><Input field="badge" placeholder="Ex: Coup de cœur, Nouveau" /></F>
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <ImageUploader value={data.images} onChange={(urls) => set("images", urls)} label="Photos du bien" maxFiles={15} />
          </div>
        </div>
      </div>
    </form>
  );
}
