"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface CarFormData {
  title: string; brand: string; model: string; year: number | string;
  price: number | string; priceType: string; mileage: number | string;
  fuel: string; transmission: string; color: string; condition: string;
  city: string; location: string; description: string; badge: string;
  status: string; featured: boolean;
  seoTitle: string; metaDescription: string;
  images: string[];
}

const INIT: CarFormData = {
  title: "", brand: "", model: "", year: new Date().getFullYear(),
  price: "", priceType: "SALE", mileage: "",
  fuel: "Essence", transmission: "Automatique", color: "", condition: "USED",
  city: "Abidjan", location: "", description: "", badge: "",
  status: "ACTIVE", featured: false,
  seoTitle: "", metaDescription: "",
  images: [],
};

const CITIES = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Treichville", "Adjamé", "Koumassi", "Port-Bouët", "San-Pédro", "Bouaké", "Daloa"];
const FUELS = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
const TRANSMISSIONS = ["Automatique", "Manuelle"];

export default function CarForm({ initialData, carId }: { initialData?: Partial<CarFormData>; carId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<CarFormData>({ ...INIT, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof CarFormData, value: any) => setData((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = carId ? `/api/cars/${carId}` : "/api/cars";
    const method = carId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, price: Number(data.price), year: Number(data.year), mileage: Number(data.mileage) }),
    });

    if (res.ok) {
      router.push("/admin/automobiles");
      router.refresh();
    } else {
      const err = await res.json();
      setError(err.error || "Erreur lors de la sauvegarde");
      setSaving(false);
    }
  };

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-white/60 mb-1.5">{label}</label>
      {children}
    </div>
  );

  const Input = ({ field, ...props }: { field: keyof CarFormData } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      value={String(data[field] ?? "")}
      onChange={(e) => set(field, e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 transition-colors"
    />
  );

  const Select = ({ field, options }: { field: keyof CarFormData; options: { value: string; label: string }[] }) => (
    <select
      value={String(data[field] ?? "")}
      onChange={(e) => set(field, e.target.value)}
      className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/50 transition-colors"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-nova-red/20"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {carId ? "Mettre à jour" : "Créer l'annonce"}
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Informations générales</h2>
            <F label="Titre de l'annonce *"><Input field="title" placeholder="Ex: BMW Série 5 M Sport 2023" required /></F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Marque"><Input field="brand" placeholder="BMW, Mercedes..." /></F>
              <F label="Modèle"><Input field="model" placeholder="Série 5, Classe C..." /></F>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <F label="Année"><Input field="year" type="number" min="1990" max="2026" /></F>
              <F label="Kilométrage"><Input field="mileage" type="number" placeholder="15000" /></F>
              <F label="Couleur"><Input field="color" placeholder="Noir, Blanc..." /></F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F label="Carburant"><Select field="fuel" options={FUELS.map(f => ({ value: f, label: f }))} /></F>
              <F label="Transmission"><Select field="transmission" options={TRANSMISSIONS.map(t => ({ value: t, label: t }))} /></F>
            </div>
            <F label="Description">
              <textarea
                value={data.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Décrivez le véhicule en détail..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors"
              />
            </F>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">SEO</h2>
            <F label="Titre SEO"><Input field="seoTitle" placeholder="Titre pour les moteurs de recherche" /></F>
            <F label="Meta description">
              <textarea
                value={data.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50 resize-none transition-colors"
              />
            </F>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Prix & Statut</h2>
            <F label="Prix (CFA) *"><Input field="price" type="number" min="0" required placeholder="28500000" /></F>
            <F label="Type d'annonce"><Select field="priceType" options={[{ value: "SALE", label: "Vente" }, { value: "RENT", label: "Location" }]} /></F>
            <F label="Condition"><Select field="condition" options={[{ value: "USED", label: "Occasion" }, { value: "NEW", label: "Neuf" }]} /></F>
            <F label="Statut"><Select field="status" options={[{ value: "ACTIVE", label: "Actif" }, { value: "SOLD", label: "Vendu" }, { value: "PENDING", label: "En attente" }, { value: "INACTIVE", label: "Inactif" }]} /></F>
            <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="featured" checked={data.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-nova-red" />
              <label htmlFor="featured" className="text-sm text-white/60">Mettre en avant</label>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm border-b border-white/5 pb-3">Localisation</h2>
            <F label="Ville"><Select field="city" options={CITIES.map(c => ({ value: c, label: c }))} /></F>
            <F label="Quartier / Adresse"><Input field="location" placeholder="Ex: Cocody, Angré" /></F>
            <F label="Badge personnalisé"><Input field="badge" placeholder="Ex: Promotion, Nouveau, Rare" /></F>
          </div>

          <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
            <ImageUploader value={data.images} onChange={(urls) => set("images", urls)} label="Photos du véhicule" maxFiles={12} />
          </div>
        </div>
      </div>
    </form>
  );
}
