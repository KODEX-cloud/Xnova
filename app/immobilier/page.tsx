"use client";

import { useEffect, useState } from "react";
import ListingShell from "@/components/immobilier/ListingShell";

const DEFAULTS: Record<string, string> = {
  "hero.title":    "Toutes les annonces immobilières",
  "hero.subtitle": "Villas, maisons, appartements, terrains et studios meublés à Abidjan et partout en Côte d'Ivoire.",
  "hero.badge":    "Immobilier NOVA",
};

export default function ImmobilierPage() {
  const [c, setC] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=page.immobilier.")
      .then(r => r.json())
      .then(data => setC(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const g = (key: string) => c[key] || DEFAULTS[key] || "";

  return (
    <ListingShell
      title={g("hero.title")}
      subtitle={g("hero.subtitle")}
      badge={g("hero.badge")}
      apiQuery=""
      accentColor="red"
    />
  );
}
