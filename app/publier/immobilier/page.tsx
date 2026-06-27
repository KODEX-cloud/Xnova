"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Home, ChevronRight, ChevronLeft, Upload, X, Loader2,
  CheckCircle2, AlertCircle, Info,
} from "lucide-react";

const STEPS = ["Informations", "Caractéristiques", "Prix & Photos"];

const PROP_TYPES = [
  { value: "HOUSE", label: "Maison / Villa" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "STUDIO", label: "Studio meublé" },
  { value: "LAND", label: "Terrain" },
  { value: "OFFICE", label: "Bureau / Commerce" },
];
const PRICE_TYPES = [{ value: "SALE", label: "Vente" }, { value: "RENT", label: "Location" }];

type FormData = {
  title: string; description: string; propertyType: string; priceType: string;
  surface: string; land: string; rooms: string; baths: string;
  price: string; city: string; district: string; location: string;
  images: string[];
};

const INIT: FormData = {
  title: "", description: "", propertyType: "HOUSE", priceType: "SALE",
  surface: "", land: "", rooms: "", baths: "",
  price: "", city: "", district: "", location: "",
  images: [],
};

function saveToStorage(data: { id: string; type: string; title: string; price: string; createdAt: string; plan: string }) {
  try {
    const existing = JSON.parse(localStorage.getItem("nova_listings") || "[]");
    existing.unshift(data);
    localStorage.setItem("nova_listings", JSON.stringify(existing.slice(0, 50)));
  } catch {}
}

export default function PublierImmobilierPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INIT);
  const [errors, setErrors] = useState<Partial<FormData & { images: string }>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = () => {
    const e: any = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = "Le titre est requis";
      if (!form.description.trim()) e.description = "La description est requise";
    }
    if (step === 1) {
      if (!form.surface || parseInt(form.surface) <= 0) e.surface = "Surface requise";
    }
    if (step === 2) {
      if (!form.price || parseInt(form.price) < 0) e.price = "Prix invalide";
      if (!form.city.trim()) e.city = "La ville est requise";
      if (form.images.length === 0) e.images = "Au moins une photo est requise";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/annonces/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setForm(f => ({ ...f, images: [...f.images, ...urls].slice(0, 10) }));
    setUploading(false);
  };

  const removeImage = (url: string) =>
    setForm(f => ({ ...f, images: f.images.filter(u => u !== url) }));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "IMMOBILIER", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      saveToStorage({ id: data.id, type: "IMMOBILIER", title: form.title, price: form.price, createdAt: new Date().toISOString(), plan: "" });
      localStorage.setItem("nova_pending_id", data.id);
      localStorage.setItem("nova_pending_type", "IMMOBILIER");
      localStorage.setItem("nova_pending_title", form.title);
      router.push("/paiement");
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isLand = form.propertyType === "LAND";

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl">Publier un bien immobilier</h1>
            <p className="text-white/40 text-sm">Étape {step + 1} sur {STEPS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-500 text-white" : "bg-white/10 text-white/30"
              }`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-white" : "text-white/30"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? "bg-green-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-nova-navy rounded-3xl border border-white/5 p-8">
        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Informations générales</h2>

              <Field label="Titre de l'annonce *" error={(errors as any).title}>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="ex: Villa F4 à Cocody — Piscine & Jardin" className={inp((errors as any).title)} />
              </Field>

              <Field label="Type de bien">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROP_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => set("propertyType", t.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${form.propertyType === t.value ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Type de transaction">
                <div className="grid grid-cols-2 gap-3">
                  {PRICE_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => set("priceType", t.value)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.priceType === t.value ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Description *" error={(errors as any).description}>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={4} placeholder="Décrivez votre bien — équipements, état général, accès, environnement…"
                  className={`${inp((errors as any).description)} resize-none`} />
              </Field>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Caractéristiques du bien</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Surface habitable (m²) *" error={(errors as any).surface}>
                  <input type="number" value={form.surface} onChange={e => set("surface", e.target.value)}
                    placeholder="150" className={inp((errors as any).surface)} />
                </Field>
                <Field label="Surface terrain (m²)">
                  <input type="number" value={form.land} onChange={e => set("land", e.target.value)}
                    placeholder="500" className={inp()} />
                </Field>
              </div>

              {!isLand && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nombre de pièces">
                    <input type="number" value={form.rooms} onChange={e => set("rooms", e.target.value)}
                      placeholder="4" min="1" max="30" className={inp()} />
                  </Field>
                  <Field label="Salles de bain">
                    <input type="number" value={form.baths} onChange={e => set("baths", e.target.value)}
                      placeholder="2" min="0" max="20" className={inp()} />
                  </Field>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15">
                <p className="text-blue-400 text-xs font-semibold mb-1">Conseils pour une annonce performante</p>
                <ul className="text-white/45 text-xs space-y-1">
                  <li>• Précisez les équipements (climatisation, groupe électrogène, sécurité…)</li>
                  <li>• Mentionnez l'accès (bitumée, sécurisée, gardien…)</li>
                  <li>• Indiquez le document foncier disponible</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Prix & Localisation & Photos</h2>

              <Field label={`Prix (FCFA${form.priceType === "RENT" ? "/mois" : ""}) *`} error={(errors as any).price}>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                  placeholder="50 000 000" className={inp((errors as any).price)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Ville *" error={(errors as any).city}>
                  <input value={form.city} onChange={e => set("city", e.target.value)}
                    placeholder="Abidjan" className={inp((errors as any).city)} />
                </Field>
                <Field label="Commune / Quartier">
                  <input value={form.district} onChange={e => set("district", e.target.value)}
                    placeholder="Cocody, Marcory…" className={inp()} />
                </Field>
              </div>

              <Field label="Adresse / Zone précise">
                <input value={form.location} onChange={e => set("location", e.target.value)}
                  placeholder="Près de l'école X, boulevard Y…" className={inp()} />
              </Field>

              {/* Photos */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-2 uppercase tracking-wide">
                  Photos ({form.images.length}/10) *
                </label>
                {(errors as any).images && <p className="text-nova-red text-xs mb-2">{(errors as any).images}</p>}

                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => e.target.files && uploadImages(e.target.files)} />

                <button type="button" onClick={() => fileRef.current?.click()}
                  disabled={uploading || form.images.length >= 10}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-white/15 hover:border-blue-500/40 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-40">
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin text-blue-400" /> : <Upload className="h-6 w-6" />}
                  <span className="text-sm font-medium">{uploading ? "Upload en cours…" : "Ajouter des photos"}</span>
                  <span className="text-xs">JPEG, PNG, WebP — max 5 Mo par photo</span>
                </button>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative group aspect-square rounded-xl overflow-hidden">
                        <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized />
                        {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">Principale</span>}
                        <button onClick={() => removeImage(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submitError && (
                <div className="flex items-center gap-2 bg-nova-red/10 border border-nova-red/20 rounded-xl px-4 py-3 text-nova-red text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {submitError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
          {step > 0 ? (
            <button onClick={prev} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-all">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all">
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold transition-all">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Publication…</> : <><CheckCircle2 className="h-4 w-4" /> Publier l'annonce</>}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-white/30 text-xs px-2">
        <Info className="h-3.5 w-3.5 flex-shrink-0" />
        Votre annonce sera vérifiée par notre équipe avant publication (délai : 24h).
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-nova-red text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function inp(error?: string) {
  return `w-full bg-white/5 border ${error ? "border-nova-red/60" : "border-white/10"} rounded-2xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-blue-500/50 transition-colors`;
}
