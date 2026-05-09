import BlogListingShell from "@/components/blog/BlogListingShell";

export const metadata = { title: "Actualités | Nova" };

export default function BlogActualitesPage() {
  return (
    <BlogListingShell
      title="Actualités"
      subtitle="Les dernières nouvelles du marché automobile et immobilier en Côte d'Ivoire."
      apiQuery="category=Actualité"
      activeTab="/blog/actualites"
      emptyMessage="Aucune actualité pour l'instant."
    />
  );
}
