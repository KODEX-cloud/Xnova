import BlogListingShell from "@/components/blog/BlogListingShell";

export const metadata = { title: "Blog Automobile | Nova" };

export default function BlogAutomobilePage() {
  return (
    <BlogListingShell
      title="Conseils Automobile"
      subtitle="Actualités, guides d'achat et conseils pour votre voiture."
      apiQuery="category=Automobile"
      activeTab="/blog/automobile"
      emptyMessage="Aucun article automobile pour l'instant."
    />
  );
}
