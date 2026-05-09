"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Car, Home, MapPin, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const carTypes = [
  "Tous les types",
  "Berline",
  "SUV / 4x4",
  "Pickup",
  "Citadine",
  "Utilitaire",
  "Luxe",
];

const propertyTypes = [
  "Tous les types",
  "Villa",
  "Appartement",
  "Terrain",
  "Studio meublé",
  "Immeuble",
  "Commerce",
];

const cities = [
  "Toute la Côte d'Ivoire",
  "Abidjan",
  "Cocody",
  "Plateau",
  "Marcory",
  "Yopougon",
  "Treichville",
  "San-Pédro",
  "Bouaké",
  "Yamoussoukro",
];

const budgetsCar = [
  "Tous les budgets",
  "Moins de 5M CFA",
  "5M – 10M CFA",
  "10M – 20M CFA",
  "20M – 50M CFA",
  "Plus de 50M CFA",
];

const budgetsImmo = [
  "Tous les budgets",
  "Moins de 20M CFA",
  "20M – 50M CFA",
  "50M – 100M CFA",
  "100M – 200M CFA",
  "Plus de 200M CFA",
];

export default function SearchSection() {
  const [activeTab, setActiveTab] = useState<"automobile" | "immobilier">(
    "automobile"
  );
  const [transactionType, setTransactionType] = useState<"achat" | "location">(
    "achat"
  );

  return (
    <section
      id="recherche"
      className="relative bg-white py-16 lg:py-20 overflow-hidden"
    >
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nova-red via-nova-orange to-nova-yellow" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #E30613 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          <motion.p
            className="text-nova-red text-sm font-semibold uppercase tracking-widest mb-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Recherche avancée
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-nova-dark"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Trouvez votre bien idéal
          </motion.h2>
          <motion.p
            className="text-nova-gray mt-2 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Automobiles et propriétés à travers toute la Côte d&apos;Ivoire
          </motion.p>
        </div>

        {/* Search Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl shadow-nova-dark/10 border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {/* Tab Header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("automobile")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 py-5 text-sm font-semibold transition-all duration-300",
                activeTab === "automobile"
                  ? "text-white bg-nova-red"
                  : "text-nova-gray hover:text-nova-dark hover:bg-gray-50"
              )}
            >
              <Car className="h-5 w-5" />
              Automobile
            </button>
            <button
              onClick={() => setActiveTab("immobilier")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 py-5 text-sm font-semibold transition-all duration-300",
                activeTab === "immobilier"
                  ? "text-white bg-nova-red"
                  : "text-nova-gray hover:text-nova-dark hover:bg-gray-50"
              )}
            >
              <Home className="h-5 w-5" />
              Immobilier
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {/* Transaction Type */}
            <div className="flex gap-2 mb-6">
              {(["achat", "location"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTransactionType(type)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200",
                    transactionType === type
                      ? "border-nova-red bg-nova-red/5 text-nova-red"
                      : "border-gray-200 text-nova-gray hover:border-gray-300"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Type */}
              <div className="relative">
                <label className="block text-xs font-semibold text-nova-dark/60 uppercase tracking-wider mb-2">
                  {activeTab === "automobile" ? "Type de véhicule" : "Type de bien"}
                </label>
                <div className="relative">
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-nova-dark focus:outline-none focus:border-nova-red focus:ring-2 focus:ring-nova-red/10 transition-all cursor-pointer pr-10">
                    {(activeTab === "automobile" ? carTypes : propertyTypes).map(
                      (type) => (
                        <option key={type}>{type}</option>
                      )
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div className="relative">
                <label className="block text-xs font-semibold text-nova-dark/60 uppercase tracking-wider mb-2">
                  Ville / Zone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray z-10" />
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-10 py-3.5 text-sm text-nova-dark focus:outline-none focus:border-nova-red focus:ring-2 focus:ring-nova-red/10 transition-all cursor-pointer">
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray pointer-events-none" />
                </div>
              </div>

              {/* Budget */}
              <div className="relative">
                <label className="block text-xs font-semibold text-nova-dark/60 uppercase tracking-wider mb-2">
                  Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray z-10" />
                  <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-10 py-3.5 text-sm text-nova-dark focus:outline-none focus:border-nova-red focus:ring-2 focus:ring-nova-red/10 transition-all cursor-pointer">
                    {(activeTab === "automobile" ? budgetsCar : budgetsImmo).map(
                      (b) => (
                        <option key={b}>{b}</option>
                      )
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray pointer-events-none" />
                </div>
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-xs font-semibold text-nova-dark/60 uppercase tracking-wider mb-2">
                  Mot-clé
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nova-gray" />
                  <input
                    type="text"
                    placeholder={
                      activeTab === "automobile" ? "BMW, Toyota..." : "Villa Cocody..."
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3.5 text-sm text-nova-dark placeholder-nova-gray/60 focus:outline-none focus:border-nova-red focus:ring-2 focus:ring-nova-red/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button className="w-full py-4 bg-gradient-to-r from-nova-red to-nova-orange hover:from-nova-orange hover:to-nova-red text-white font-bold rounded-2xl text-base transition-all duration-300 hover:shadow-xl hover:shadow-nova-red/25 hover:scale-[1.01] flex items-center justify-center gap-3 group">
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Rechercher maintenant
            </button>
          </div>
        </motion.div>

        {/* Quick stats below */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 text-center">
          {[
            { value: "1 200+", label: "Voitures disponibles" },
            { value: "800+", label: "Propriétés listées" },
            { value: "350+", label: "Transactions réalisées" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl font-black text-nova-red">{stat.value}</span>
              <span className="text-nova-gray text-xs mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
