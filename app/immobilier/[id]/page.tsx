"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, BedDouble, Bath, Maximize2, Phone, MessageCircle,
  ArrowLeft, Home, ChevronLeft, ChevronRight, Share2,
  Heart, Calendar, Eye, Tag, Building2, CheckCircle2, Loader2,
  ZoomIn, X, Layers,
} from "lucide-react";
import { formatPrice } from "@/components/immobilier/PropertyCard";

const TYPE_LABELS: Record<string, string> = {
  VILLA: "Villa", HOUSE: "Maison", APARTMENT: "Appartement",
  LAND: "Terrain", STUDIO: "Studio meublé", OFFICE: "Bureau",
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80";

function parseImages(raw: any): string[] {
  if (Array.isArray(raw) && raw.length) return raw;
  try { const a = JSON.parse(raw || "[]"); return Array.isArray(a) && a.length ? a : []; }
  catch { return []; }
}

function parseAmenities(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  try { const a = JSON.parse(raw || "[]"); return Array.isArray(a) ? a : []; }
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

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
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
      fetch(`/api/properties/${id}`).then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]).then(([prop, settings]) => {
      if (prop?.error) { setLoading(false); return; }
      setProperty(prop);
      setCfg(settings || {});
      const q = prop.type ? `type=${prop.type}&limit=5&status=ACTIVE` : "limit=5&status=ACTIVE";
      return fetch(`/api/properties?${q}`).then(r => r.json());
    }).then(data => {
      if (data?.properties) setRelated(data.properties.filter((p: any) => p.id !== id).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const sendLead = async () => {
    if (!form.name || !form.phone) return;
    setSending(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PROPERTY", name: form.name, phone: form.phone, message: form.message || `Intérêt pour : ${property?.title}`, listingId: property?.id, source: "detail_page" }),
    }).catch(() => {});
    setSending(false); setSent(true);
    setTimeout(() => { setSent(false); setModal(false); }, 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-10 w-10 text-nova-red animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-center px-4">
      <Building2 className="h-16 w-16 text-gray-300" />
      <h1 className="text-gray-800 text-xl font-bold">Bien introuvable</h1>
      <p className="text-gray-500 text-sm">Ce bien n&apos;existe pas ou a été retiré.</p>
      <Link href="/immobilier" className="px-5 py-2.5 bg-nova-red text-white rounded-xl font-semibold hover:bg-nova-red/90 transition-colors">
        Voir les annonces
      </Link>
    </div>
  );

  const images    = parseImages(property.images);
  const allImgs   = images.length ? images : [PLACEHOLDER];
  const amenities = parseAmenities(property.amenities);
  const isRent    = property.priceType === "RENT";
  const phone     = cfg.phone || cfg.whatsapp || "+225 07 00 00 00 00";
  const wa        = (cfg.whatsapp || phone).replace(/\s/g, "");
  const waMsg     = encodeURIComponent(`Bonjour, je suis intéressé(e) par "${property.title}"`);

  const specs = [
    { icon: Building2,  label: "Type",              value: TYPE_LABELS[property.type] || property.type },
    { icon: MapPin,     label: "Ville",              value: property.city },
    property.district  ? { icon: MapPin,    label: "Quartier",         value: property.district } : null,
    property.bedrooms  ? { icon: BedDouble, label: "Chambres",         value: `${property.bedrooms} chambre${property.bedrooms > 1 ? "s" : ""}` } : null,
    property.bathrooms ? { icon: Bath,      label: "Salles de bain",   value: `${property.bathrooms}` } : null,
    property.surface   ? { icon: Maximize2, label: "Surface habitable", value: `${property.surface} m²` } : null,
    property.land      ? { icon: Maximize2, label: "Terrain",          value: `${property.land} m²` } : null,
    { icon: Tag,        label: "Transaction",        value: isRent ? "Location" : "Vente" },
    property.views     ? { icon: Eye,      label: "Vues",              value: String(property.views) } : null,
    property.createdAt ? { icon: Calendar, label: "Mis en ligne",      value: new Date(property.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) } : null,
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs text-white/50">
          <Home className="h-3.5 w-3.5" />
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/immobilier" className="hover:text-white transition-colors">Immobilier</Link>
          <span>/</span>
          <span className="text-white/30 truncate max-w-[200px]">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/immobilier" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors group">
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
                    <Image src={allImgs[imgIdx]} alt={property.title} fill className="object-cover"
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
                  {property.badge && <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-nova-orange text-white shadow-sm">{property.badge}</span>}
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
                <Building2 className="h-5 w-5 text-nova-red" /> Description
              </h2>
              {property.description
                ? <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{property.description}</p>
                : <p className="text-gray-400 italic text-sm">Aucune description disponible.</p>}
            </div>

            {/* Characteristics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-gray-900 font-bold text-lg mb-5 flex items-center gap-2">
                <Layers className="h-5 w-5 text-nova-red" /> Caractéristiques
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

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-nova-red" /> Équipements &amp; services
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{a}</span>
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
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{isRent ? "Loyer mensuel" : "Prix de vente"}</p>
                  <p className="text-nova-red font-black text-3xl leading-none">{formatPrice(property.price, property.priceType)}</p>
                </div>
                <button onClick={() => setLiked(l => !l)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-nova-red/40 hover:bg-red-50 transition-all">
                  <Heart className={`h-5 w-5 transition-colors ${liked ? "fill-nova-red text-nova-red" : "text-gray-400"}`} />
                </button>
              </div>

              <h2 className="text-gray-900 font-bold text-base leading-snug mb-2">{property.title}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
                <MapPin className="h-4 w-4 text-nova-red flex-shrink-0" />
                {[property.district, property.city].filter(Boolean).join(", ") || "Abidjan, Côte d'Ivoire"}
              </div>

              {(property.bedrooms || property.bathrooms || property.surface || property.land) && (
                <div className="flex flex-wrap items-center gap-4 py-4 border-y border-gray-100 mb-5 text-sm text-gray-600">
                  {property.bedrooms && <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-nova-orange" />{property.bedrooms} ch.</span>}
                  {property.bathrooms && <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-nova-orange" />{property.bathrooms} sdb.</span>}
                  {(property.surface || property.land) && <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4 text-nova-orange" />{property.surface || property.land} m²</span>}
                </div>
              )}

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
                  <Calendar className="h-5 w-5" /> Réserver une visite
                </button>
              </div>

              <button
                onClick={() => { if (navigator.share) navigator.share({ title: property.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 text-gray-400 hover:text-gray-700 text-sm transition-colors">
                <Share2 className="h-4 w-4" /> Partager ce bien
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 font-bold text-xl">Biens similaires</h2>
              <Link href="/immobilier" className="text-nova-red text-sm hover:underline">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p: any) => {
                const img = parseImages(p.images)[0] || PLACEHOLDER;
                return (
                  <Link key={p.id} href={`/immobilier/${p.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={img.startsWith("/")} />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 line-clamp-1 mb-1">{p.title}</p>
                      <p className="text-nova-red font-semibold text-sm">{formatPrice(p.price, p.priceType)}</p>
                      {p.city && <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</p>}
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
              <h3 className="text-gray-900 font-bold text-lg mb-1">Réserver une visite</h3>
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
