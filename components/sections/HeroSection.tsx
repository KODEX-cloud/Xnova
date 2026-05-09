"use client";

import React, { useEffect, useState } from "react";
import AnimatedHero from "@/components/ui/animated-hero";

interface HeroSettings {
  heroLine1: string;
  heroLine2: string;
  heroSubtitle: string;
  heroBadge: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
}

const defaults: HeroSettings = {
  heroLine1: "Votre Partenaire",
  heroLine2: "Premium CI",
  heroSubtitle: "Découvrez les meilleures voitures et propriétés d'Abidjan. NOVA vous connecte aux offres les plus exclusives en automobile et immobilier en Côte d'Ivoire.",
  heroBadge: "Marketplace #1 en Côte d'Ivoire — Plus de 2000 annonces",
  heroPrimaryBtn: "Explorer les annonces",
  heroSecondaryBtn: "Déposer une annonce",
};

export default function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(defaults);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setSettings({
          heroLine1: data.heroLine1 || defaults.heroLine1,
          heroLine2: data.heroLine2 || defaults.heroLine2,
          heroSubtitle: data.heroSubtitle || defaults.heroSubtitle,
          heroBadge: data.heroBadge || defaults.heroBadge,
          heroPrimaryBtn: data.heroPrimaryBtn || defaults.heroPrimaryBtn,
          heroSecondaryBtn: data.heroSecondaryBtn || defaults.heroSecondaryBtn,
        });
      })
      .catch(() => {});
  }, []);

  const handleScrollToSearch = () => {
    const el = document.getElementById("recherche");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToListings = () => {
    const el = document.getElementById("annonces");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero">
      <AnimatedHero
        trustBadge={{ text: settings.heroBadge, icons: ["★"] }}
        headline={{ line1: settings.heroLine1, line2: settings.heroLine2 }}
        subtitle={settings.heroSubtitle}
        buttons={{
          primary: { text: settings.heroPrimaryBtn, onClick: handleScrollToListings },
          secondary: { text: settings.heroSecondaryBtn, onClick: handleScrollToSearch },
        }}
      />
    </section>
  );
}
