"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize2, Heart, ArrowRight, MessageCircle, Eye } from "lucide-react";

export interface Property {
  id: string; slug: string; title: string; price: number;
  priceType: string; type: string; city?: string; district?: string;
  bedrooms?: number; bathrooms?: number; surface?: number; land?: number;
  images: string | string[]; badge?: string; status: string;
  planType?: string; isBoosted?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  VILLA: "Villa", HOUSE: "Maison", APARTMENT: "Appartement",
  LAND: "Terrain", STUDIO: "Studio meublé", OFFICE: "Bureau",
};

export function firstImage(images: string | string[]): string {
  try {
    const arr = typeof images === "string" ? JSON.parse(images) : images;
    return Array.isArray(arr) && arr.length > 0
      ? arr[0]
      : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80";
  } catch {
    return "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80";
  }
}

export function formatPrice(price: number, priceType: string) {
  const n = new Intl.NumberFormat("fr-FR").format(price);
  return priceType === "RENT" ? `${n} CFA/mois` : `${n} CFA`;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-56 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-gray-100 rounded-lg w-16" />
          <div className="h-3 bg-gray-100 rounded-lg w-16" />
          <div className="h-3 bg-gray-100 rounded-lg w-16" />
        </div>
        <div className="h-10 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function PropertyCard({ property, whatsapp = "" }: { property: Property; whatsapp?: string }) {
  const [liked, setLiked] = useState(false);
  const img = firstImage(property.images);
  const isRent = property.priceType === "RENT";
  const href = `/immobilier/${property.slug || property.id}`;
  const location = [property.district, property.city].filter(Boolean).join(", ");
  const isPremium = property.planType === "PREMIUM" || property.isBoosted;

  const waText = encodeURIComponent(`Bonjour NOVA, je suis intéressé(e) par le bien : "${property.title}" — ${formatPrice(property.price, property.priceType)}. Pouvez-vous me donner plus d'informations ?`);
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waText}` : "#";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/60 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <Link href={href} className="block absolute inset-0">
          <Image
            src={img} alt={property.title} fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={img.startsWith("/")}
          />
          {/* Gradient overlay — always visible at bottom for price */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${isRent ? "bg-emerald-500/90" : "bg-nova-red/90"}`}>
            {isRent ? "Location" : "Vente"}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-sm text-white/90">
            {TYPE_LABELS[property.type] || property.type}
          </span>
          {isPremium && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/90 text-gray-900 shadow-lg backdrop-blur-sm">
              ✦ Premium
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-nova-red/80 transition-all duration-200"
        >
          <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-nova-red text-nova-red" : "text-white"}`} />
        </button>

        {/* Price at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
          <span className="text-white font-black text-lg drop-shadow-lg">
            {formatPrice(property.price, property.priceType)}
          </span>
          {/* Hover CTA */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Eye className="h-3 w-3" /> Voir
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={href}>
          <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-nova-red transition-colors duration-200">
            {property.title}
          </h3>
        </Link>

        {location && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
            <MapPin className="h-3.5 w-3.5 text-nova-red flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Stats */}
        {(property.bedrooms || property.bathrooms || property.surface || property.land) ? (
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            {property.bedrooms ? (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />
                {property.bedrooms} ch.
              </span>
            ) : null}
            {property.bathrooms ? (
              <span className="flex items-center gap-1.5">
                <Bath className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />
                {property.bathrooms} sdb.
              </span>
            ) : null}
            {(property.surface || property.land) ? (
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-nova-orange flex-shrink-0" />
                {property.surface || property.land} m²
              </span>
            ) : null}
          </div>
        ) : <div className="mb-4" />}

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          <Link
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-nova-red/40 hover:bg-orange-50 text-gray-700 hover:text-nova-red text-xs font-bold transition-all duration-200 group/btn"
          >
            Voir détails
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          {whatsapp && (
            <a
              href={waHref}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold transition-all duration-200"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
