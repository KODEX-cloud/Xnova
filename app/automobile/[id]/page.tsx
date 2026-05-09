"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, MessageCircle, ArrowLeft, Home, ChevronLeft,
  ChevronRight, Share2, Heart, Calendar, Eye, Tag, Car,
  CheckCircle2, Loader2, ZoomIn, X, Fuel, Gauge, Settings2,
  Palette, Hash, Layers,
} from "lucide-react";
import { formatPrice } from "@/components/automobile/CarCard";

const PLACEHOLDER = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80";
const CONDITION_LABELS: Record<string, string> = { NEW: "Neuf", USED: "Occasion", CERTIFIED: "Certifié" };
const FUEL_LABELS: Record<string, string> = { Essence: "Essence", Diesel: "Diesel", Electrique: "Électrique", Hybride: "Hybride" };

function parseImages(raw: any): string[] {
  if (Array.isArray(raw) && raw.length) return raw;
  try { const a = JSON.parse(raw || "[]"); return Array.isArray(a) && a.length ? a : []; }
  catch { return []; }
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setI(n => (n - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setI(n => (n + 1) % images.length);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [images.length, onClose]);

  return (
    <motion.div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10">
        <X className="h-5 w-5" />
      </button>
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setI(n => (n - 1 + images.length) % images.length); }}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); setI(n => (n + 1) % images.length); }}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 z-10">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="relative w-full max-w-5xl max-h-[85vh] aspect-video mx-16" onClick={e => e.stopPropagation()}>
        <Image src={images[i]} alt="" fill className="object-contain" unoptimized={images[i]?.startsWith("/")} />
      </div>
      <span className="absolute bottom-4 text-white/60 text-sm">{i + 1} / {images.length}</span>
    </motion.div>
  );
}

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [car,      setCar]      = useState<any>(null);
  const [related,  setRelated]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked,    setLiked]    = useState(false);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ name: "", phone: "", message: "" });
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [cfg,      setCfg]      = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/cars/${id}`).then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]).then(([carData, settings]) => {
      if (carData?.error) { setLoading(false); return; }
      setCar(carData);
      setCfg(settings || {});
      const q = carData.brand ? `brand=${encodeURIComponent(carData.brand)}&limit=5&status=ACTIVE` : "limit=5&status=ACTIVE";
      return fetch(`/api/cars?${q}`).then(r => r.json());
    }).then(data => {
      if (data?.cars) setRelated(data.cars.filter((c: any) => c.id !== id).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const sendLead = async () => {
    if (!form.name || !form.phone) return;
    setSending(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "CAR", name: form.name, phone: form.phone, message: form.message || `Intérêt pour : ${car?.title}`, listingId: car?.id, source: "detail_page" }),
    }).catch(() => {});
    setSending(false); setSent(true);
    setTimeout(() => { setSent(false); setModal(false); }, 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-nova-red animate-spin" />
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-center px-4">
      <Car className="h-16 w-16 text-gray-300" />
      <h1 className="text-gray-800 text-xl font-bold">Véhicule introuvable</h1>
      <p className="text-gray-500 text-sm">Ce véhicule n&apos;existe pas ou a été retiré.</p>
      <Link href="/automobile/vente" className="px-5 py-2.5 bg-nova-red text-white rounded-xl font-semibold hover:bg-nova-red/90 transition-colors">
        Voir les annonces
      </Link>
    </div>
  );

  const allImgs = parseImages(car.images);
  if (!allImgs.length) allImgs.push(PLACEHOLDER);
  const isRent  = car.priceType === "RENT";
  const phone   = cfg.phone || cfg.whatsapp || "+225 07 00 00 00 00";
  const wa      = (cfg.whatsapp || phone).replace(/\s/g, "");
  const waMsg   = encodeURIComponent(`Bonjour, je suis intéressé(e) par "${car.title}" — ${formatPrice(car.price, car.priceType)}`);

  const specs = [
    car.brand        ? { icon: Car,       label: "Marque",          value: car.brand } : null,
    car.model        ? { icon: Car,       label: "Modèle",          value: car.model } : null,
    car.year         ? { icon: Calendar,  label: "Année",           value: String(car.year) } : null,
    car.mileage != null ? { icon: Gauge,  label: "Kilométrage",     value: `${Number(car.mileage).toLocaleString("fr-FR")} km` } : null,
    car.fuel         ? { icon: Fuel,      label: "Carburant",       value: FUEL_LABELS[car.fuel] || car.fuel } : null,
    car.transmission ? { icon: Settings2, label: "Transmission",    value: car.transmission } : null,
    car.color        ? { icon: Palette,   label: "Couleur",         value: car.color } : null,
    car.condition    ? { icon: Tag,       label: "État",            value: CONDITION_LABELS[car.condition] || car.condition } : null,
    car.city         ? { icon: MapPin,    label: "Localisation",    value: car.city } : null,
    { icon: Tag,       label: "Transaction",   value: isRent ? "Location" : "Vente" },
    car.views        ? { icon: Eye,       label: "Vues",            value: String(car.views) } : null,
    car.createdAt    ? { icon: Hash,      label: "Mis en ligne",    value: new Date(car.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-white/50">
          <Home className="h-3.5 w-3.5" />
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/automobile/vente" className="hover:text-white transition-colors">Automobile</Link>
          <span>/</span>
          <span className="text-white/30 truncate max-w-[200px]">{car.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/automobile/vente" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-[16/9] overflow-hidden cursor-zoom-in group"
                onClick={() => setLightbox(imgIdx)}>
                <AnimatePresence mode="wait">
                  <motion.div key={imgIdx} className="absolute inset-0"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <Image src={allImgs[imgIdx]} alt={car.title} fill className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 67vw" priority unoptimized={allImgs[imgIdx]?.startsWith("/")} />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2 text-white text-sm font-medium">
                    <ZoomIn className="h-4 w-4" /> Agrandir
                  </div>
                </div>

                {allImgs.length > 1 && (
                  <>
                    <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + allImgs.length) % allImgs.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 z-10">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % allImgs.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 z-10">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium">
                      {imgIdx + 1} / {allImgs.length}
                    </span>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${isRent ? "bg-emerald-500" : "bg-nova-red"}`}>
                    {isRent ? "Location" : "Vente"}
                  </span>
                  {car.badge && <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-nova-orange text-white shadow-sm">{car.badge}</span>}
                  {car.condition === "NEW" && <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">Neuf</span>}
                </div>
              </div>

              {allImgs.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto bg-gray-50 border-t border-gray-100">
                  {allImgs.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-nova-red" : "border-transparent opacity-50 hover:opacity-80"}`}>
                      <Image src={img} alt="" width={80} height={64} className="object-cover w-full h-full" unoptimized={img.startsWith("/")} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-nova-red" /> Description
              </h2>
              {car.description
                ? <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{car.description}</p>
                : <p className="text-gray-400 italic text-sm">Aucune description disponible pour ce véhicule.</p>}
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
                <Layers className="h-5 w-5 text-nova-red" /> Caractéristiques techniques
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-nova-red/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-nova-red" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs leading-none mb-1">{item.label}</p>
                        <p className="text-gray-900 text-sm font-semibold leading-tight">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key highlights */}
            {(car.fuel || car.transmission || car.mileage != null || car.year) && (
              <div className="bg-gradient-to-r from-nova-red/5 to-nova-orange/5 rounded-2xl border border-nova-red/10 p-6">
                <h2 className="text-gray-900 font-bold text-base mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-nova-red" /> Points forts
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    car.year        && `Année ${car.year}`,
                    car.mileage != null && `${Number(car.mileage).toLocaleString("fr-FR")} km au compteur`,
                    car.fuel        && `Motorisation ${car.fuel}`,
                    car.transmission && `Boîte ${car.transmission}`,
                    car.condition   && `État : ${CONDITION_LABELS[car.condition] || car.condition}`,
                    car.color       && `Couleur ${car.color}`,
                  ].filter(Boolean).map((point, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                      <CheckCircle2 className="h-4 w-4 text-nova-red flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{isRent ? "Tarif / jour" : "Prix de vente"}</p>
                  <p className="text-nova-red font-black text-3xl leading-none">{formatPrice(car.price, car.priceType)}</p>
                </div>
                <button onClick={() => setLiked(l => !l)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-nova-red/40 hover:bg-red-50 transition-all">
                  <Heart className={`h-5 w-5 transition-colors ${liked ? "fill-nova-red text-nova-red" : "text-gray-400"}`} />
                </button>
              </div>

              <h2 className="text-gray-900 font-bold text-base leading-snug mb-2">{car.title}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin className="h-4 w-4 text-nova-red flex-shrink-0" />
                {car.location || car.city || "Abidjan, Côte d'Ivoire"}
              </div>

              {/* Quick specs strip */}
              <div className="flex flex-wrap gap-2 py-4 border-y border-gray-100 mb-5">
                {car.year && <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{car.year}</span>}
                {car.fuel && <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{car.fuel}</span>}
                {car.transmission && <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{car.transmission}</span>}
                {car.mileage != null && <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{Number(car.mileage).toLocaleString("fr-FR")} km</span>}
              </div>

              <div className="space-y-3">
                <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20">
                  <MessageCircle className="h-5 w-5" /> Contacter par WhatsApp
                </a>
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 border border-gray-200 hover:border-nova-red/30 hover:bg-red-50 text-gray-800 font-semibold rounded-xl transition-all">
                  <Phone className="h-5 w-5 text-nova-red" /> {phone}
                </a>
                <button onClick={() => setModal(true)}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl transition-colors shadow-lg shadow-nova-red/20">
                  <Calendar className="h-5 w-5" /> {isRent ? "Réserver ce véhicule" : "Demander un essai"}
                </button>
              </div>

              <button
                onClick={() => { if (navigator.share) navigator.share({ title: car.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 text-gray-400 hover:text-gray-700 text-sm transition-colors">
                <Share2 className="h-4 w-4" /> Partager cette annonce
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-bold text-xl">Véhicules similaires</h2>
              <Link href="/automobile/vente" className="text-nova-red text-sm hover:underline">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c: any) => {
                const img = parseImages(c.images)[0] || PLACEHOLDER;
                return (
                  <Link key={c.id} href={`/automobile/${c.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={img} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={img.startsWith("/")} />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 line-clamp-1 mb-1">{c.title}</p>
                      <p className="text-nova-red font-semibold text-sm">{formatPrice(c.price, c.priceType)}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {c.year && <span className="text-xs text-gray-500">{c.year}</span>}
                        {c.fuel && <span className="text-xs text-gray-400">· {c.fuel}</span>}
                        {c.city && <span className="text-xs text-gray-400">· {c.city}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && <Lightbox images={allImgs} index={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
            <motion.div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
              <h3 className="text-gray-900 font-bold text-lg mb-1">{isRent ? "Réserver ce véhicule" : "Demander un essai"}</h3>
              <p className="text-gray-500 text-sm mb-5">Laissez vos coordonnées, nous vous rappelons sous 24h.</p>
              {sent ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <p className="text-gray-900 font-semibold">Demande envoyée !</p>
                  <p className="text-gray-500 text-sm">Nous vous contacterons très bientôt.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { key: "name", placeholder: "Votre nom *", type: "text" },
                    { key: "phone", placeholder: "Téléphone / WhatsApp *", type: "tel" },
                  ].map(f => (
                    <input key={f.key} type={f.type} placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30" />
                  ))}
                  <textarea placeholder="Message (optionnel)" rows={3} value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nova-red/30 resize-none" />
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setModal(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm hover:text-gray-800 transition-colors">Annuler</button>
                    <button onClick={sendLead} disabled={sending || !form.name || !form.phone}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-nova-red hover:bg-nova-red/90 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
