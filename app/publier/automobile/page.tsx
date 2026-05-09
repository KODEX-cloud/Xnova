"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Car, ChevronRight, ChevronLeft, Upload, X, Loader2,
  CheckCircle2, AlertCircle, ImageIcon, Info,
} from "lucide-react";

const STEPS = ["Informations", "Détails techniques", "Prix & Photos"];

const FUELS = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
const TRANSMISSIONS = ["Manuelle", "Automatique", "Semi-automatique"];
const CONDITIONS = ["Neuf", "Très bon état", "Bon état", "Correct", "À rénover"];
const PRICE_TYPES = [{ value: "SALE", label: "Vente" }, { value: "RENT", label: "Location" }];

type FormData = {
  title: string; description: string; brand: string; model: string;
  year: string; mileage: string; fuel: string; transmission: string;
  color: string; condition: string; priceType: string; price: string;
  city: string; location: string; images: string[];
};

const INIT: FormData = {
  title: "", description: "", brand: "", model: "",
  year: "", mileage: "", fuel: "", transmission: "",
  color: "", condition: "Bon état", priceType: "SALE", price: "",
  city: "", location: "", images: [],
};

function saveToStorage(data: { id: string; type: string; title: string; price: string; createdAt: string; plan: string }) {
  try {
    const existing = JSON.parse(localStorage.getItem("nova_listings") || "[]");
    existing.unshift(data);
    localStorage.setItem("nova_listings", JSON.stringify(existing.slice(0, 50)));
  } catch {}
}

export default function PublierAutoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INIT);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateStep = () => {
    const e: Partial<FormData> = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = "Le titre est requis";
      if (!form.description.trim()) e.description = "La description est requise";
      if (!form.brand.trim()) e.brand = "La marque est requise";
    }
    if (step === 1) {
      if (!form.year || parseInt(form.year) < 1950 || parseInt(form.year) > new Date().getFullYear() + 1)
        e.year = "Année invalide";
      if (!form.fuel) e.fuel = "Sélectionnez le carburant";
    }
    if (step === 2) {
      if (!form.price || parseInt(form.price) < 0) e.price = "Prix invalide";
      if (!form.city.trim()) e.city = "La ville est requise";
      if (form.images.length === 0) (e as any).images = "Au moins une photo est requise";
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
        body: JSON.stringify({ type: "AUTOMOBILE", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      saveToStorage({ id: data.id, type: "AUTOMOBILE", title: form.title, price: form.price, createdAt: new Date().toISOString(), plan: "" });
      localStorage.setItem("nova_pending_id", data.id);
      localStorage.setItem("nova_pending_type", "AUTOMOBILE");
      localStorage.setItem("nova_pending_title", form.title);
      router.push("/paiement");
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-nova-red flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-2xl">Publier un véhicule</h1>
            <p className="text-white/40 text-sm">Étape {step + 1} sur {STEPS.length}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-nova-red text-white" : "bg-white/10 text-white/30"
              }`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-white" : "text-white/30"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? "bg-green-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="bg-nova-navy rounded-3xl border border-white/5 p-8">
        <AnimatePresence mode="wait">
          {/* STEP 0 — Basic info */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Informations générales</h2>

              <Field label="Titre de l'annonce *" error={(errors as any).title}>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="ex: BMW X5 2022 — Excellent état" className={inp(errors.title)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Marque *" error={errors.brand}>
                  <input value={form.brand} onChange={e => set("brand", e.target.value)}
                    placeholder="BMW, Toyota…" className={inp(errors.brand)} />
                </Field>
                <Field label="Modèle">
                  <input value={form.model} onChange={e => set("model", e.target.value)}
                    placeholder="X5, Corolla…" className={inp()} />
                </Field>
              </div>

              <Field label="Description *" error={errors.description}>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={4} placeholder="Décrivez votre véhicule en détail — état, équipements, historique…"
                  className={`${inp(errors.description)} resize-none`} />
              </Field>

              <Field label="Condition">
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(c => (
                    <button key={c} type="button" onClick={() => set("condition", c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.condition === c ? "bg-nova-red/20 border-nova-red/40 text-nova-red" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </motion.div>
          )}

          {/* STEP 1 — Technical */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Détails techniques</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Année *" error={errors.year}>
                  <input type="number" value={form.year} onChange={e => set("year", e.target.value)}
                    placeholder="2022" min="1950" max={new Date().getFullYear() + 1} className={inp(errors.year)} />
                </Field>
                <Field label="Kilométrage">
                  <input type="number" value={form.mileage} onChange={e => set("mileage", e.target.value)}
                    placeholder="45 000" className={inp()} />
                </Field>
              </div>

              <Field label="Carburant *" error={errors.fuel}>
                <div className="flex flex-wrap gap-2">
                  {FUELS.map(f => (
                    <button key={f} type="button" onClick={() => set("fuel", f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.fuel === f ? "bg-nova-red/20 border-nova-red/40 text-nova-red" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}>
                      {f}
                    </button>
                  ))}
                </div>
                {errors.fuel && <p className="text-nova-red text-xs mt-1">{errors.fuel}</p>}
              </Field>

              <Field label="Transmission">
                <div className="flex gap-2">
                  {TRANSMISSIONS.map(t => (
                    <button key={t} type="button" onClick={() => set("transmission", t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${form.transmission === t ? "bg-nova-red/20 border-nova-red/40 text-nova-red" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Couleur">
                <input value={form.color} onChange={e => set("color", e.target.value)}
                  placeholder="Noir, Blanc, Gris…" className={inp()} />
              </Field>
            </motion.div>
          )}

          {/* STEP 2 — Price & Photos */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-white font-bold text-lg mb-6">Prix & Localisation & Photos</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select value={form.priceType} onChange={e => set("priceType", e.target.value)} className={inp()}>
                    {PRICE_TYPES.map(p => <option key={p.value} value={p.value} className="bg-nova-dark">{p.label}</option>)}
                  </select>
                </Field>
                <Field label="Prix (FCFA) *" error={errors.price}>
                  <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                    placeholder="15 000 000" className={inp(errors.price)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Ville *" error={errors.city}>
                  <input value={form.city} onChange={e => set("city", e.target.value)}
                    placeholder="Abidjan" className={inp(errors.city)} />
                </Field>
                <Field label="Quartier / Zone">
                  <input value={form.location} onChange={e => set("location", e.target.value)}
                    placeholder="Cocody, Plateau…" className={inp()} />
                </Field>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-white/60 text-xs font-semibold mb-2 uppercase tracking-wide">
                  Photos ({form.images.length}/10) *
                </label>
                {(errors as any).images && (
                  <p className="text-nova-red text-xs mb-2">{(errors as any).images}</p>
                )}

                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => e.target.files && uploadImages(e.target.files)} />

                <button type="button" onClick={() => fileRef.current?.click()}
                  disabled={uploading || form.images.length >= 10}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-white/15 hover:border-nova-red/40 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-40">
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin text-nova-red" /> : <Upload className="h-6 w-6" />}
                  <span className="text-sm font-medium">{uploading ? "Upload en cours…" : "Cliquer pour ajouter des photos"}</span>
                  <span className="text-xs">JPEG, PNG, WebP — max 5 Mo par photo</span>
                </button>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative group aspect-square rounded-xl overflow-hidden">
                        <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" unoptimized />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-[10px] bg-nova-red text-white px-1.5 py-0.5 rounded font-bold">Principale</span>
                        )}
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
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {submitError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
          {step > 0 ? (
            <button onClick={prev} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-all">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-nova-red hover:bg-nova-red/90 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-nova-red/30">
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-nova-red hover:bg-nova-red/90 disabled:opacity-60 text-white font-bold transition-all hover:shadow-lg hover:shadow-nova-red/30">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Publication…</> : <><CheckCircle2 className="h-4 w-4" /> Publier l'annonce</>}
            </button>
          )}
        </div>
      </div>

      {/* Info */}
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
  return `w-full bg-white/5 border ${error ? "border-nova-red/60" : "border-white/10"} rounded-2xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-nova-red/50 transition-colors`;
}
