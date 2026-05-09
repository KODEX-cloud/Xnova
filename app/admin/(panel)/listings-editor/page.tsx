"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import PlaceholderExt from "@tiptap/extension-placeholder";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NextImage from "next/image";
import {
  ArrowLeft, Save, Loader2, Images, FileText, Wrench, Eye,
  Plus, X, Star, Bold, Italic, Underline, List, ListOrdered,
  Heading2, RotateCcw, Upload, Car, Building2, GripVertical,
  Check, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "content" | "media" | "equipment" | "preview";
type Kind = "car" | "property";

interface FormData {
  // Common
  title: string;
  description: string;
  price: number | string;
  priceType: string;
  city: string;
  location: string;
  badge: string;
  status: string;
  featured: boolean;
  images: string[];
  seoTitle: string;
  metaDescription: string;
  // Car-specific
  brand?: string;
  model?: string;
  year?: number | string;
  mileage?: number | string;
  fuel?: string;
  transmission?: string;
  color?: string;
  condition?: string;
  // Property-specific
  type?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  surface?: number | string;
  land?: number | string;
  district?: string;
  amenities?: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CITIES = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Treichville", "Adjamé", "Koumassi", "Port-Bouët", "San-Pédro", "Bouaké", "Daloa"];
const FUELS = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
const TRANSMISSIONS = ["Automatique", "Manuelle"];
const PROP_TYPES = [
  { value: "VILLA", label: "Villa" }, { value: "HOUSE", label: "Maison" },
  { value: "APARTMENT", label: "Appartement" }, { value: "LAND", label: "Terrain" },
  { value: "STUDIO", label: "Studio" }, { value: "OFFICE", label: "Bureau" },
];
const CAR_CONDITIONS = [
  { value: "USED", label: "Occasion" }, { value: "NEW", label: "Neuf" }, { value: "CERTIFIED", label: "Certifié" },
];
const STATUSES_CAR = [
  { value: "ACTIVE", label: "Actif" }, { value: "SOLD", label: "Vendu" },
  { value: "PENDING", label: "En attente" }, { value: "INACTIVE", label: "Inactif" },
];
const STATUSES_PROP = [
  { value: "ACTIVE", label: "Disponible" }, { value: "SOLD", label: "Vendu" },
  { value: "RENTED", label: "Loué" }, { value: "PENDING", label: "En attente" },
  { value: "INACTIVE", label: "Inactif" },
];
const AMENITY_SUGGESTIONS = [
  "Piscine", "Jardin", "Parking", "Climatisation", "Gardien 24h/24", "Groupe électrogène",
  "Eau courante", "Internet haut débit", "Cuisine équipée", "Balcon", "Terrasse",
  "Vue dégagée", "Sécurité", "Ascenseur", "Cave", "Buanderie", "Salle de sport",
  "Espace BBQ", "Accès PMR", "Digicode",
];

// ─── Sortable Image Item ──────────────────────────────────────────────────────

function SortableImage({
  url, index, onRemove,
}: { url: string; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative group aspect-square rounded-xl overflow-hidden border-2 select-none",
        index === 0 ? "border-nova-red shadow-md shadow-nova-red/20" : "border-transparent",
        isDragging && "opacity-50 z-50 scale-105 shadow-xl"
      )}
    >
      <NextImage
        src={url}
        alt=""
        fill
        className="object-cover pointer-events-none"
        unoptimized={url.startsWith("/")}
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/50 rounded flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={12} />
      </div>

      {/* Remove button */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1.5">
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Badges */}
      {index === 0 && (
        <span className="absolute top-1.5 right-1.5 bg-nova-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
          <Star size={8} fill="white" /> Principal
        </span>
      )}
      <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
        {index + 1}
      </span>
    </div>
  );
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────

function RichTextToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const Btn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors",
        active ? "bg-nova-red text-white" : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-100 bg-gray-50 rounded-t-xl">
      <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras (Ctrl+B)">
        <Bold size={13} />
      </Btn>
      <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique (Ctrl+I)">
        <Italic size={13} />
      </Btn>
      <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Souligné (Ctrl+U)">
        <Underline size={13} />
      </Btn>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Titre H2">
        <Heading2 size={13} />
      </Btn>
      <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces">
        <List size={13} />
      </Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée">
        <ListOrdered size={13} />
      </Btn>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <Btn onClick={() => editor.chain().focus().clearContent().run()} title="Effacer">
        <RotateCcw size={13} />
      </Btn>
    </div>
  );
}

// ─── Field Helpers ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>;
}

function InputField({
  value, onChange, placeholder, type = "text", min, max, required,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50 transition-all"
    />
  );
}

function SelectField({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50 transition-all"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Format price ─────────────────────────────────────────────────────────────

function formatPrice(price: number | string) {
  const n = Number(price);
  if (!n) return "—";
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

// ─── Main Editor Component ────────────────────────────────────────────────────

function ListingsEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const kind = (searchParams.get("type") || "car") as Kind;
  const id = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [contentInitialized, setContentInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const [data, setData] = useState<FormData>({
    title: "", description: "", price: "", priceType: "SALE",
    city: "Abidjan", location: "", badge: "", status: "ACTIVE", featured: false,
    images: [], seoTitle: "", metaDescription: "",
    brand: "", model: "", year: new Date().getFullYear(), mileage: "",
    fuel: "Essence", transmission: "Automatique", color: "", condition: "USED",
    type: "VILLA", bedrooms: "", bathrooms: "", surface: "", land: "",
    district: "", amenities: [],
  });

  // TipTap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      UnderlineExt,
      PlaceholderExt.configure({ placeholder: "Décrivez le bien ou le véhicule en détail…" }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setData((d) => ({ ...d, description: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] px-4 py-3 text-sm text-gray-800 focus:outline-none tiptap-content",
      },
    },
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Load data
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const url = kind === "car" ? `/api/cars/${id}` : `/api/properties/${id}`;
    fetch(url)
      .then((r) => r.json())
      .then((raw) => {
        setData((prev) => ({
          ...prev,
          title: raw.title ?? "",
          description: raw.description ?? "",
          price: raw.price ?? "",
          priceType: raw.priceType ?? "SALE",
          city: raw.city ?? "Abidjan",
          location: raw.location ?? "",
          badge: raw.badge ?? "",
          status: raw.status ?? "ACTIVE",
          featured: raw.featured ?? false,
          images: Array.isArray(raw.images) ? raw.images : [],
          seoTitle: raw.seoTitle ?? "",
          metaDescription: raw.metaDescription ?? "",
          // Car
          brand: raw.brand ?? "",
          model: raw.model ?? "",
          year: raw.year ?? new Date().getFullYear(),
          mileage: raw.mileage ?? "",
          fuel: raw.fuel ?? "Essence",
          transmission: raw.transmission ?? "Automatique",
          color: raw.color ?? "",
          condition: raw.condition ?? "USED",
          // Property
          type: raw.type ?? "VILLA",
          bedrooms: raw.bedrooms ?? "",
          bathrooms: raw.bathrooms ?? "",
          surface: raw.surface ?? "",
          land: raw.land ?? "",
          district: raw.district ?? "",
          amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, kind]);

  // Sync description to TipTap once
  useEffect(() => {
    if (editor && data.description && !contentInitialized && !editor.isDestroyed) {
      editor.commands.setContent(data.description);
      setContentInitialized(true);
    }
  }, [editor, data.description, contentInitialized]);

  const set = useCallback((key: keyof FormData, value: any) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  // Image drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.images.indexOf(active.id as string);
      const newIndex = data.images.indexOf(over.id as string);
      set("images", arrayMove(data.images, oldIndex, newIndex));
    }
  };

  // Upload images
  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/annonces/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) newUrls.push(json.url);
      } catch {}
    }
    set("images", [...data.images, ...newUrls]);
    setUploading(false);
  }, [data.images, set]);

  // Amenity management
  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim();
    if (!trimmed || data.amenities?.includes(trimmed)) return;
    set("amenities", [...(data.amenities || []), trimmed]);
    setNewAmenity("");
  };

  const removeAmenity = (amenity: string) => {
    set("amenities", (data.amenities || []).filter((a) => a !== amenity));
  };

  // Save
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    const url = kind === "car" ? `/api/cars/${id}` : `/api/properties/${id}`;
    const body: any = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      priceType: data.priceType,
      city: data.city,
      location: data.location,
      badge: data.badge,
      status: data.status,
      featured: data.featured,
      images: data.images,
      seoTitle: data.seoTitle,
      metaDescription: data.metaDescription,
    };

    if (kind === "car") {
      Object.assign(body, {
        brand: data.brand, model: data.model,
        year: data.year ? Number(data.year) : null,
        mileage: data.mileage ? Number(data.mileage) : null,
        fuel: data.fuel, transmission: data.transmission,
        color: data.color, condition: data.condition,
      });
    } else {
      Object.assign(body, {
        type: data.type,
        bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        surface: data.surface ? Number(data.surface) : null,
        land: data.land ? Number(data.land) : null,
        district: data.district,
        amenities: data.amenities,
      });
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const err = await res.json();
        setError(err.error || "Erreur lors de la sauvegarde");
      }
    } catch (e: any) {
      setError(e.message || "Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-nova-red animate-spin" />
      </div>
    );
  }

  const mainImage = data.images[0] || null;
  const statuses = kind === "car" ? STATUSES_CAR : STATUSES_PROP;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <span className={cn(
              "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full",
              kind === "car" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
            )}>
              {kind === "car" ? <Car size={12} /> : <Building2 size={12} />}
              {kind === "car" ? "Automobile" : "Immobilier"}
            </span>
            {data.title && (
              <span className="text-gray-900 font-semibold text-sm truncate max-w-[300px]">{data.title}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {error && (
              <span className="flex items-center gap-1.5 text-red-600 text-xs">
                <AlertCircle size={14} /> {error}
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                <Check size={14} /> Sauvegardé
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-nova-red/20"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Sauvegarder
            </button>
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div className="flex border-t border-gray-100 px-6">
          {([
            { id: "content", icon: FileText, label: "Contenu" },
            { id: "media", icon: Images, label: `Médias (${data.images.length})` },
            { id: "equipment", icon: Wrench, label: kind === "car" ? "Caractéristiques" : "Équipements" },
            { id: "preview", icon: Eye, label: "Aperçu" },
          ] as { id: Tab; icon: any; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-nova-red text-nova-red"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              )}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ─── CONTENT TAB ─────────────────────────────────────────────────── */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-5">
              {/* General info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="text-gray-900 font-semibold text-sm border-b border-gray-100 pb-3">Informations générales</h2>

                <div>
                  <FieldLabel>Titre de l'annonce *</FieldLabel>
                  <InputField value={data.title} onChange={(v) => set("title", v)} placeholder="Ex: BMW Série 5 M Sport 2023" required />
                </div>

                {kind === "car" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Marque</FieldLabel>
                        <InputField value={data.brand || ""} onChange={(v) => set("brand", v)} placeholder="BMW, Mercedes…" />
                      </div>
                      <div>
                        <FieldLabel>Modèle</FieldLabel>
                        <InputField value={data.model || ""} onChange={(v) => set("model", v)} placeholder="Série 5, Classe C…" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <FieldLabel>Année</FieldLabel>
                        <InputField value={data.year || ""} onChange={(v) => set("year", v)} type="number" min={1990} max={2030} />
                      </div>
                      <div>
                        <FieldLabel>Kilométrage</FieldLabel>
                        <InputField value={data.mileage || ""} onChange={(v) => set("mileage", v)} type="number" placeholder="15000" />
                      </div>
                      <div>
                        <FieldLabel>Couleur</FieldLabel>
                        <InputField value={data.color || ""} onChange={(v) => set("color", v)} placeholder="Noir, Blanc…" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Carburant</FieldLabel>
                        <SelectField value={data.fuel || "Essence"} onChange={(v) => set("fuel", v)} options={FUELS.map((f) => ({ value: f, label: f }))} />
                      </div>
                      <div>
                        <FieldLabel>Transmission</FieldLabel>
                        <SelectField value={data.transmission || "Automatique"} onChange={(v) => set("transmission", v)} options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>État du véhicule</FieldLabel>
                      <SelectField value={data.condition || "USED"} onChange={(v) => set("condition", v)} options={CAR_CONDITIONS} />
                    </div>
                  </>
                )}

                {kind === "property" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Type de bien</FieldLabel>
                        <SelectField value={data.type || "VILLA"} onChange={(v) => set("type", v)} options={PROP_TYPES} />
                      </div>
                      <div>
                        <FieldLabel>Quartier</FieldLabel>
                        <InputField value={data.district || ""} onChange={(v) => set("district", v)} placeholder="Ex: Angré, Riviera" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <FieldLabel>Chambres</FieldLabel>
                        <InputField value={data.bedrooms || ""} onChange={(v) => set("bedrooms", v)} type="number" min={0} placeholder="4" />
                      </div>
                      <div>
                        <FieldLabel>Salles de bain</FieldLabel>
                        <InputField value={data.bathrooms || ""} onChange={(v) => set("bathrooms", v)} type="number" min={0} placeholder="2" />
                      </div>
                      <div>
                        <FieldLabel>Surface (m²)</FieldLabel>
                        <InputField value={data.surface || ""} onChange={(v) => set("surface", v)} type="number" min={0} placeholder="250" />
                      </div>
                      <div>
                        <FieldLabel>Terrain (m²)</FieldLabel>
                        <InputField value={data.land || ""} onChange={(v) => set("land", v)} type="number" min={0} placeholder="500" />
                      </div>
                    </div>
                  </>
                )}

                {/* Description — rich text */}
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-nova-red/30 focus-within:border-nova-red/50 transition-all">
                    <RichTextToolbar editor={editor} />
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-gray-900 font-semibold text-sm border-b border-gray-100 pb-3">SEO</h2>
                <div>
                  <FieldLabel>Titre SEO</FieldLabel>
                  <InputField value={data.seoTitle} onChange={(v) => set("seoTitle", v)} placeholder="Titre optimisé pour Google" />
                  <p className="text-xs text-gray-400 mt-1">{data.seoTitle.length}/60 caractères recommandés</p>
                </div>
                <div>
                  <FieldLabel>Meta description</FieldLabel>
                  <textarea
                    value={data.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    rows={2}
                    placeholder="Courte description pour les résultats de recherche…"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50 resize-none transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">{data.metaDescription.length}/160 caractères recommandés</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Preview image */}
              {mainImage && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <NextImage src={mainImage} alt="" fill className="object-cover" unoptimized={mainImage.startsWith("/")} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/40 px-2 py-0.5 rounded-full">
                      {data.images.length} photo{data.images.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Prix & Statut */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="text-gray-900 font-semibold text-sm border-b border-gray-100 pb-3">Prix & Statut</h2>
                <div>
                  <FieldLabel>Prix (FCFA)</FieldLabel>
                  <InputField value={data.price} onChange={(v) => set("price", v)} type="number" min={0} placeholder="28 500 000" />
                </div>
                <div>
                  <FieldLabel>Type d'annonce</FieldLabel>
                  <SelectField value={data.priceType} onChange={(v) => set("priceType", v)} options={[{ value: "SALE", label: "Vente" }, { value: "RENT", label: "Location" }]} />
                </div>
                <div>
                  <FieldLabel>Statut</FieldLabel>
                  <SelectField value={data.status} onChange={(v) => set("status", v)} options={statuses} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative flex-shrink-0",
                      data.featured ? "bg-nova-red" : "bg-gray-200"
                    )}
                    onClick={() => set("featured", !data.featured)}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                      data.featured ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </div>
                  <span className="text-sm text-gray-700">Mettre en vedette</span>
                </label>
              </div>

              {/* Localisation */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="text-gray-900 font-semibold text-sm border-b border-gray-100 pb-3">Localisation</h2>
                <div>
                  <FieldLabel>Ville</FieldLabel>
                  <SelectField value={data.city} onChange={(v) => set("city", v)} options={CITIES.map((c) => ({ value: c, label: c }))} />
                </div>
                <div>
                  <FieldLabel>Adresse / Quartier</FieldLabel>
                  <InputField value={data.location} onChange={(v) => set("location", v)} placeholder="Ex: Rue des Jardins, Angré" />
                </div>
                <div>
                  <FieldLabel>Badge personnalisé</FieldLabel>
                  <InputField value={data.badge} onChange={(v) => set("badge", v)} placeholder="Ex: Coup de cœur, Rare" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MEDIA TAB ───────────────────────────────────────────────────── */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-gray-900 font-semibold">Gestion des photos</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Glissez pour réorganiser • La 1ʳᵉ photo est la photo principale</p>
                </div>
                <span className="text-sm text-gray-500">{data.images.length} photo{data.images.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Upload zone */}
              <label className={cn(
                "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors mb-6",
                uploading ? "border-nova-red/40 bg-nova-red/5" : "border-gray-200 hover:border-nova-red/40 hover:bg-gray-50"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-nova-red animate-spin" />
                    <p className="text-sm text-nova-red font-medium">Upload en cours…</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Glissez vos photos ici</p>
                      <p className="text-xs text-gray-500 mt-0.5">ou <span className="text-nova-red">cliquez pour parcourir</span> — JPG, PNG, WebP — 5 Mo max</p>
                    </div>
                  </>
                )}
              </label>

              {/* Sortable image grid */}
              {data.images.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={data.images} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {data.images.map((url, i) => (
                        <SortableImage
                          key={url}
                          url={url}
                          index={i}
                          onRemove={() => set("images", data.images.filter((u) => u !== url))}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Images className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">Aucune photo ajoutée</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Star size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                <strong>Conseil :</strong> La première photo (marquée "Principal") est celle qui apparaît dans les cards et les résultats de recherche. Mettez votre meilleure photo en premier.
              </p>
            </div>
          </div>
        )}

        {/* ─── EQUIPMENT / FEATURES TAB ────────────────────────────────────── */}
        {activeTab === "equipment" && (
          <div className="space-y-6">
            {kind === "property" ? (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                  <div>
                    <h2 className="text-gray-900 font-semibold">Équipements & Commodités</h2>
                    <p className="text-gray-500 text-sm mt-0.5">Ajoutez les équipements disponibles dans ce bien</p>
                  </div>

                  {/* Add amenity input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(newAmenity); } }}
                      placeholder="Ex: Piscine, Parking, Climatisation…"
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 focus:border-nova-red/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => addAmenity(newAmenity)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-nova-red text-white text-sm font-medium rounded-xl hover:bg-nova-red/90 transition-colors"
                    >
                      <Plus size={15} /> Ajouter
                    </button>
                  </div>

                  {/* Current amenities */}
                  {(data.amenities || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(data.amenities || []).map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-full"
                        >
                          <Check size={13} className="text-emerald-600" />
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="ml-0.5 text-emerald-500 hover:text-red-500 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-gray-700 font-medium text-sm">Suggestions rapides</h3>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_SUGGESTIONS.filter((s) => !(data.amenities || []).includes(s)).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addAmenity(s)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-full hover:border-nova-red/40 hover:text-nova-red hover:bg-nova-red/5 transition-colors"
                      >
                        <Plus size={12} /> {s}
                      </button>
                    ))}
                    {AMENITY_SUGGESTIONS.filter((s) => !(data.amenities || []).includes(s)).length === 0 && (
                      <p className="text-sm text-gray-400">Toutes les suggestions ont été ajoutées.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Car: show key specs summary */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div>
                  <h2 className="text-gray-900 font-semibold">Caractéristiques du véhicule</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Récapitulatif des specs saisis dans l'onglet "Contenu"</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Marque", value: data.brand || "—" },
                    { label: "Modèle", value: data.model || "—" },
                    { label: "Année", value: data.year ? String(data.year) : "—" },
                    { label: "Kilométrage", value: data.mileage ? `${Number(data.mileage).toLocaleString("fr-FR")} km` : "—" },
                    { label: "Carburant", value: data.fuel || "—" },
                    { label: "Transmission", value: data.transmission || "—" },
                    { label: "Couleur", value: data.color || "—" },
                    { label: "État", value: CAR_CONDITIONS.find((c) => c.value === data.condition)?.label || "—" },
                    { label: "Ville", value: data.city || "—" },
                    { label: "Prix", value: formatPrice(data.price) },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs mb-0.5">{spec.label}</p>
                        <p className="text-gray-900 text-sm font-semibold">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400">Pour modifier ces données, utilisez l'onglet <strong>Contenu</strong>.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PREVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === "preview" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Cover image */}
              <div className="relative aspect-[16/9] bg-gray-100">
                {mainImage ? (
                  <NextImage src={mainImage} alt="" fill className="object-cover" unoptimized={mainImage.startsWith("/")} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Images className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {data.badge && (
                    <span className="bg-nova-red text-white text-xs font-bold px-2.5 py-1 rounded-full">{data.badge}</span>
                  )}
                  {data.featured && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star size={10} fill="white" /> Vedette
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <p className="text-white font-bold text-xl drop-shadow">{formatPrice(data.price)}</p>
                    <p className="text-white/80 text-xs">{data.priceType === "RENT" ? "/ mois" : "à vendre"}</p>
                  </div>
                  <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    {data.images.length} photo{data.images.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-gray-900 font-bold text-xl leading-tight">{data.title || "Titre non défini"}</h1>
                  <p className="text-gray-500 text-sm mt-1">{[data.city, data.location].filter(Boolean).join(", ") || "Localisation non définie"}</p>
                </div>

                {/* Specs pills */}
                <div className="flex flex-wrap gap-2">
                  {kind === "car" && [
                    data.year && String(data.year),
                    data.fuel,
                    data.transmission,
                    data.mileage && `${Number(data.mileage).toLocaleString("fr-FR")} km`,
                  ].filter(Boolean).map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{spec}</span>
                  ))}
                  {kind === "property" && [
                    data.bedrooms && `${data.bedrooms} ch.`,
                    data.bathrooms && `${data.bathrooms} sdb`,
                    data.surface && `${data.surface} m²`,
                    PROP_TYPES.find((t) => t.value === data.type)?.label,
                  ].filter(Boolean).map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{spec}</span>
                  ))}
                </div>

                {/* Description preview */}
                {data.description && data.description !== "<p></p>" && (
                  <div
                    className="text-gray-600 text-sm prose prose-sm max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                )}

                {/* Amenities preview */}
                {kind === "property" && (data.amenities || []).length > 0 && (
                  <div>
                    <p className="text-gray-900 font-semibold text-sm mb-2">Équipements</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(data.amenities || []).map((a) => (
                        <span key={a} className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1">
                          <Check size={10} /> {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="pt-3 border-t border-gray-100">
                  <span className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full",
                    data.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                    data.status === "SOLD" || data.status === "RENTED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {statuses.find((s) => s.value === data.status)?.label || data.status}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO preview */}
            {(data.seoTitle || data.title) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Aperçu Google</p>
                <p className="text-blue-600 text-base font-medium leading-tight hover:underline cursor-pointer">
                  {data.seoTitle || data.title}
                </p>
                <p className="text-green-700 text-xs">
                  nova-marketplace.com/{kind === "car" ? "automobile" : "immobilier"}/…
                </p>
                {data.metaDescription && (
                  <p className="text-gray-600 text-sm leading-snug">{data.metaDescription}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ListingsEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-nova-red animate-spin" />
      </div>
    }>
      <ListingsEditorContent />
    </Suspense>
  );
}
