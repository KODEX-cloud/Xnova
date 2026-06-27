"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft, Car, Home, MapPin, Calendar, Fuel, Gauge, Palette,
  BedDouble, Bath, Maximize, CreditCard, ExternalLink, Star, Zap,
} from "lucide-react";
import { useImageModal } from "@/contexts/imageModal";

interface AnnonceDetail {
  id: string;
  title: string;
  description?: string;
  price: number;
  city?: string;
  location?: string;
  images?: string;
  createdAt: string;
  status?: string;
  listingType: "CAR" | "PROPERTY";
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  color?: string;
  condition?: string;
  priceType?: string;
  propertyType?: string;
  surface?: number;
  rooms?: number;
  bathrooms?: number;
  land?: number;
}

function parseImages(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return raw ? [raw] : [];
  }
}

export default function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "AUTOMOBILE";
  const modal = useImageModal();

  const [data, setData] = useState<AnnonceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<string>("GRATUIT");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nova_listings");
      if (raw) {
        const list = JSON.parse(raw) as { id: string; plan: string }[];
        const found = list.find((l) => l.id === id);
        if (found) setPlan(found.plan || "GRATUIT");
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/annonces/${id}?type=${type === "IMMOBILIER" ? "PROPERTY" : "CAR"}`);
        if (!res.ok) throw new Error("Annonce introuvable");
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 mb-4">{error || "Annonce introuvable"}</p>
        <Link href="/dashboard/annonces" className="text-nova-red hover:underline text-sm">← Retour aux annonces</Link>
      </div>
    );
  }

  const images = parseImages(data.images);
  const isCar = data.listingType === "CAR";
  const PLAN_STYLE: Record<string, { label: string; color: string }> = {
    PREMIUM: { label: "Premium", color: "text-yellow-600" },
    EN_AVANT: { label: "En avant", color: "text-purple-600" },
    GRATUIT: { label: "Gratuit", color: "text-gray-400" },
  };
  const planInfo = PLAN_STYLE[plan] || PLAN_STYLE.GRATUIT;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              {images.slice(0, 4).map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`relative cursor-pointer overflow-hidden rounded-xl ${i === 0 && images.length === 1 ? "col-span-2" : ""}`}
                  style={{ aspectRatio: i === 0 && images.length >= 3 ? "16/9" : "4/3" }}
                  onClick={() => modal?.open({ src, title: data.title, price: `${Number(data.price).toLocaleString("fr-FR")} FCFA`, href: isCar ? `/automobile/vente` : `/immobilier/vente` })}
                >
                  <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
                  {i === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+{images.length - 4}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center">
              {isCar ? <Car className="h-12 w-12 text-gray-300" /> : <Home className="h-12 w-12 text-gray-300" />}
            </div>
          )}

          {/* Info */}
          <div className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-black text-gray-900 mb-1">{data.title}</h1>
                {data.city && (
                  <p className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.city}{data.location ? `, ${data.location}` : ""}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-nova-red">{Number(data.price).toLocaleString("fr-FR")}</p>
                <p className="text-gray-400 text-xs">FCFA</p>
              </div>
            </div>

            {data.description && (
              <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{data.description}</p>
            )}
          </div>

          {/* Car specs */}
          {isCar && (
            <div className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
              <h2 className="text-gray-800 font-bold text-base mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Marque", value: data.brand, icon: Car },
                  { label: "Modèle", value: data.model, icon: Car },
                  { label: "Année", value: data.year, icon: Calendar },
                  { label: "Kilométrage", value: data.mileage ? `${Number(data.mileage).toLocaleString()} km` : null, icon: Gauge },
                  { label: "Carburant", value: data.fuel, icon: Fuel },
                  { label: "Couleur", value: data.color, icon: Palette },
                ].filter((f) => f.value).map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      <div>
                        <p className="text-gray-400 text-xs">{f.label}</p>
                        <p className="text-gray-800 font-semibold text-sm">{String(f.value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Property specs */}
          {!isCar && (
            <div className="p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
              <h2 className="text-gray-800 font-bold text-base mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Type", value: data.propertyType, icon: Home },
                  { label: "Surface", value: data.surface ? `${data.surface} m²` : null, icon: Maximize },
                  { label: "Terrain", value: data.land ? `${data.land} m²` : null, icon: MapPin },
                  { label: "Chambres", value: data.rooms, icon: BedDouble },
                  { label: "Salles de bain", value: data.bathrooms, icon: Bath },
                ].filter((f) => f.value).map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      <div>
                        <p className="text-gray-400 text-xs">{f.label}</p>
                        <p className="text-gray-800 font-semibold text-sm">{String(f.value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="p-5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Statut de l'annonce</p>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${data.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-400"} animate-pulse`} />
              <span className="text-gray-800 font-semibold text-sm">{data.status === "ACTIVE" ? "Active" : "En attente de validation"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-300" />
              <p className="text-gray-400 text-xs">
                Publiée le {new Date(data.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Plan card */}
          <div className="p-5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Plan souscrit</p>
            <div className="flex items-center gap-2 mb-4">
              {plan === "PREMIUM" ? <Star className="h-5 w-5 text-yellow-500" /> : plan === "EN_AVANT" ? <Zap className="h-5 w-5 text-purple-500" /> : <CreditCard className="h-5 w-5 text-gray-300" />}
              <span className={`font-bold text-base ${planInfo.color}`}>{planInfo.label}</span>
            </div>
            {plan === "GRATUIT" && (
              <Link
                href="/paiement"
                onClick={() => {
                  localStorage.setItem("nova_pending_id", id);
                  localStorage.setItem("nova_pending_type", type);
                  localStorage.setItem("nova_pending_title", data.title);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-nova-red hover:bg-nova-red/90 text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-nova-red/30"
              >
                <Zap className="h-4 w-4" />
                Booster cette annonce
              </Link>
            )}
          </div>

          {/* Public link */}
          <div className="p-5 rounded-2xl bg-white border-2 border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Voir sur Nova</p>
            <Link
              href={isCar ? `/automobile/vente` : `/immobilier/vente`}
              target="_blank"
              className="flex items-center gap-2 text-nova-red hover:underline text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Voir les annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
