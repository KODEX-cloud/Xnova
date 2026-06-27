import BlogListingShell from "@/components/blog/BlogListingShell";

export const metadata = { title: "Blog Immobilier | Nova" };

export default function BlogImmobilierPage() {
  return (
    <BlogListingShell
      title="Conseils Immobilier"
      subtitle="Investissement, location, achat — tous nos conseils immobiliers."
      apiQuery="category=Immobilier"
      activeTab="/blog/immobilier"
      emptyMessage="Aucun article immobilier pour l'instant."
    />
  );
}
