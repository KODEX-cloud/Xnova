"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car, Fuel, Gauge, Calendar, MapPin, ArrowRight, MessageCircle, Eye } from "lucide-react";

export interface CarItem {
  id: string; slug?: string; title: string; brand?: string;
  price?: number; priceType?: string; year?: number; mileage?: number;
  fuel?: string; transmission?: string; city?: string; images?: string;
  status?: string; planType?: string; isBoosted?: boolean;
}

export function parseImages(raw?: string): string[] {
  if (!raw) return [];
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; }
  catch { return []; }
}

export function formatPrice(price?: number, priceType?: string) {
  if (!price) return "Prix sur demande";
  const formatted = price.toLocaleString("fr-FR");
  return priceType === "RENT" ? `${formatted} FCFA / mois` : `${formatted} FCFA`;
}

export function SkeletonCarCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded-lg w-16" />
        <div className="h-5 bg-gray-100 rounded-lg w-4/5" />
        <div className="h-6 bg-gray-100 rounded-lg w-2/5" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-gray-100 rounded-lg" />)}
        </div>
        <div className="h-10 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function CarCard({ car, index = 0, whatsapp = "" }: {
  car: CarItem; index?: number; whatsapp?: string;
}) {
  const imgs = parseImages(car.images);
  const img = imgs[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80";
  const href = `/automobile/${car.slug || car.id}`;
  const priceLabel = formatPrice(car.price, car.priceType);
  const isRent = car.priceType === "RENT";
  const isPremium = car.planType === "PREMIUM" || car.isBoosted;

  const waText = encodeURIComponent(`Bonjour NOVA, je suis intéressé(e) par ce véhicule : "${car.title}" — ${priceLabel}. Pouvez-vous me donner plus d'informations ?`);
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waText}` : "#";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Link href={href} className="block absolute inset-0">
          <Image
            src={img} alt={car.title} fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={img.startsWith("/")}
          />
          {/* Always-on bottom gradient for price readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Hover tint */}
          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm ${
            isRent ? "bg-blue-500/90" : "bg-gradient-to-r from-nova-red to-nova-orange"
          }`}>
            {isRent ? "Location" : "Vente"}
          </span>
          {car.brand && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-sm text-white/90">
              {car.brand}
            </span>
          )}
          {isPremium && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/90 text-gray-900 backdrop-blur-sm">
              ✦ Premium
            </span>
          )}
        </div>

        {/* Price + hover cta at bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
          <span className="text-white font-black text-base drop-shadow-lg">{priceLabel}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Eye className="h-3 w-3" /> Voir
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {(car.year || car.city) && (
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2 flex-wrap">
            {car.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>}
            {car.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{car.city}</span>}
          </div>
        )}

        <Link href={href}>
          <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-nova-red transition-colors duration-200">
            {car.title}
          </h3>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
          {car.fuel && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Fuel className="h-3 w-3 flex-shrink-0 text-nova-orange" />
              <span className="truncate">{car.fuel}</span>
            </div>
          )}
          {car.mileage !== undefined && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Gauge className="h-3 w-3 flex-shrink-0 text-nova-orange" />
              <span className="truncate">{car.mileage.toLocaleString()} km</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Car className="h-3 w-3 flex-shrink-0 text-nova-orange" />
              <span className="truncate">{car.transmission}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          <Link
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-nova-red/40 hover:bg-orange-50 text-gray-700 hover:text-nova-red text-xs font-bold transition-all duration-200 group/btn"
          >
            Voir la fiche
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
