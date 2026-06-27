"use client";

import React from "react";
import { motion } from "framer-motion";
import { ImageCarousel } from "@/components/ui/image-carousel";

const galleryImages = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    alt: "BMW Série 5 Premium",
    rotation: -15,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    alt: "Villa Moderne Cocody",
    rotation: -8,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    alt: "Mercedes Classe C AMG",
    rotation: 5,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Appartement Plateau",
    rotation: 12,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    alt: "Porsche Cayenne",
    rotation: -12,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    alt: "Villa de Luxe",
    rotation: 8,
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    alt: "Toyota Prado 4x4",
    rotation: -5,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Villa avec Piscine",
    rotation: 10,
  },
];

const features = [
  {
    title: "1200+ Véhicules",
    description: "BMW, Mercedes, Toyota, Range Rover disponibles",
  },
  {
    title: "800+ Propriétés",
    description: "Villas, appartements et terrains à Abidjan",
  },
  {
    title: "Qualité certifiée",
    description: "Chaque annonce vérifiée par nos experts NOVA",
  },
];

export default function GallerySection() {
  return (
    <section className="py-20 lg:py-28 bg-nova-dark relative overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="text-center">
          <motion.p
            className="text-nova-red text-sm font-semibold uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Notre collection
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Le meilleur de{" "}
            <span className="gradient-text-nova">NOVA</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Explorez notre sélection de véhicules et propriétés d&apos;exception disponibles dès aujourd&apos;hui
          </motion.p>
        </div>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <ImageCarousel
          title="Automobile & Immobilier de Prestige"
          subtitle="Collection NOVA 2024"
          description="Des véhicules d'exception et des propriétés exclusives sélectionnés pour vous en Côte d'Ivoire"
          ctaText="Explorer la collection"
          onCtaClick={() => {}}
          images={galleryImages}
          features={features}
        />
      </motion.div>
    </section>
  );
}
