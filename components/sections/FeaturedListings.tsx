"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Car, Home, MapPin, Heart, Fuel, BedDouble, Bath,
  Maximize2, ArrowRight, Star, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CarItem {
  id: string; title: string; price: number; priceType: string;
  city: string; images: string; year: number; mileage: number;
  fuel: string; badge: string; slug: string;
}

interface PropertyItem {
  id: string; title: string; price: number; priceType: string;
  city: string; images: string; bedrooms: number; bathrooms: number;
  surface: number; type: string; badge: string; slug: string;
}

function formatPrice(price: number, priceType: string) {
  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return priceType === "RENT" ? `${formatted} CFA/mois` : `${formatted} CFA`;
}

function firstImage(images: string, fallback: string) {
  try {
    const arr = JSON.parse(images);
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : fallback;
  } catch {
    return fallback;
  }
}

function CarCard({ car }: { car: CarItem }) {
  const [liked, setLiked] = useState(false);
  const img = firstImage(car.images, "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80");

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      layout
    >
      <div className="relative h-52 overflow-hidden">
        <Image src={img} alt={car.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {car.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-nova-red to-nova-orange shadow-md">
            {car.badge}
          </span>
        )}
        <button onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm">
          <Heart className={cn("h-4 w-4 transition-colors", liked ? "fill-nova-red text-nova-red" : "text-gray-400")} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-gray-900 font-bold text-base leading-tight group-hover:text-nova-red transition-colors">{car.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-gray-600 text-xs font-medium">4.9</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
          <MapPin className="h-3.5 w-3.5 text-nova-red flex-shrink-0" />
          {car.city}, Abidjan
        </div>
        <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5 text-nova-orange" />{car.year}</span>
          <span>{new Intl.NumberFormat("fr-FR").format(car.mileage)} km</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-nova-orange" />{car.fuel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-nova-red font-black text-lg">{formatPrice(car.price, car.priceType)}</span>
          <a href={`/automobile/${car.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-gradient-to-r hover:from-nova-red hover:to-nova-orange text-nova-red hover:text-white text-sm font-bold transition-all duration-200 group/btn">
            Voir <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function PropertyCard({ property }: { property: PropertyItem }) {
  const [liked, setLiked] = useState(false);
  const img = firstImage(property.images, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80");
  const isRent = property.priceType === "RENT";
  const badgeLabel = property.badge || (isRent ? "Location" : "Vente");

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      layout
    >
      <div className="relative h-52 overflow-hidden">
        <Image src={img} alt={property.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${isRent ? "bg-emerald-500" : "bg-gradient-to-r from-nova-red to-nova-orange"} shadow-md`}>
          {badgeLabel}
        </span>
        <span className="absolute top-3 left-[4.5rem] px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur text-gray-700">
          {property.type}
        </span>
        <button onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-all duration-200 shadow-sm">
          <Heart className={cn("h-4 w-4 transition-colors", liked ? "fill-nova-red text-nova-red" : "text-gray-400")} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-gray-900 font-bold text-base leading-tight group-hover:text-nova-red transition-colors">{property.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-gray-600 text-xs font-medium">4.9</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
          <MapPin className="h-3.5 w-3.5 text-nova-red flex-shrink-0" />
          {property.city}, Abidjan
        </div>
        <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
          {property.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5 text-nova-orange" />{property.bedrooms} ch.</span>}
          {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-nova-orange" />{property.bathrooms} sdb.</span>}
          {property.surface > 0 && <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-nova-orange" />{property.surface} m²</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-nova-red font-black text-lg">{formatPrice(property.price, property.priceType)}</span>
          <a href={`/immobilier/${property.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-gradient-to-r hover:from-nova-red hover:to-nova-orange text-nova-red hover:text-white text-sm font-bold transition-all duration-200 group/btn">
            Voir <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedListings() {
  const [activeTab, setActiveTab] = useState<"automobile" | "immobilier">("automobile");
  const [cars, setCars] = useState<CarItem[]>([]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/cars?featured=true").then(r => r.json()),
      fetch("/api/properties?featured=true").then(r => r.json()),
    ]).then(([carsData, propsData]) => {
      setCars(Array.isArray(carsData?.cars) ? carsData.cars : []);
      setProperties(Array.isArray(propsData?.properties) ? propsData.properties : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="annonces" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.span className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Annonces vedettes
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Nos meilleures offres</h2>
            <p className="text-gray-500 mt-2">Sélection premium mise à jour quotidiennement</p>
          </div>
          <div className="flex bg-white border-2 border-gray-100 rounded-2xl p-1.5 gap-1 self-start md:self-auto shadow-sm">
            <button onClick={() => setActiveTab("automobile")}
              className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === "automobile"
                  ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700")}>
              <Car className="h-4 w-4" /> Automobile
            </button>
            <button onClick={() => setActiveTab("immobilier")}
              className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === "immobilier"
                  ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700")}>
              <Home className="h-4 w-4" /> Immobilier
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-nova-red animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {activeTab === "automobile"
                ? cars.map(car => <CarCard key={car.id} car={car} />)
                : properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="text-center mt-12">
          <a href={activeTab === "automobile" ? "/automobile" : "/immobilier"}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-nova-red text-nova-red hover:bg-gradient-to-r hover:from-nova-red hover:to-nova-orange hover:text-white font-bold rounded-full text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/50 group">
            Voir toutes les annonces
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
