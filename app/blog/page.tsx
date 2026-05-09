"use client";

import { useEffect, useState } from "react";
import BlogListingShell from "@/components/blog/BlogListingShell";

const DEFAULTS: Record<string, string> = {
  "hero.title":    "Blog & Conseils",
  "hero.subtitle": "Découvrez nos meilleurs articles sur l'automobile, l'immobilier et bien plus.",
  "hero.badge":    "Articles & Actualités",
};

export default function BlogPage() {
  const [c, setC] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings?prefix=page.blog.")
      .then(r => r.json())
      .then(data => setC(typeof data === "object" && data !== null ? data : {}))
      .catch(() => {});
  }, []);

  const g = (key: string) => c[key] || DEFAULTS[key] || "";

  return (
    <BlogListingShell
      title={g("hero.title")}
      subtitle={g("hero.subtitle")}
      apiQuery=""
      activeTab="/blog"
    />
  );
}
