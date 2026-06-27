"use client";

import { useEffect, useState } from "react";
import CarListingShell from "@/components/automobile/CarListingShell";

const DEFAULTS: Record<string, string> = {
  "hero.title":    "Catalogue Automobile",
  "hero.subtitle": "BMW, Mercedes, Toyota, Range Rover et bien plus — trouvez votre prochain véhicule chez NOVA.",
  "hero.badge":    "Automobile NOVA",
};

export default function AutomobilePage() {
  const [c, setC] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=page.automobile.")
      .then(r => r.json())
      .then(data => setC(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const g = (key: string) => c[key] || DEFAULTS[key] || "";

  return (
    <CarListingShell
      title={g("hero.title")}
      subtitle={g("hero.subtitle")}
      badge={g("hero.badge")}
      apiQuery=""
      activeTab="/automobile"
    />
  );
}
