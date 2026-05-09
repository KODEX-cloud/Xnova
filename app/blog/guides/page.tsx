import BlogListingShell from "@/components/blog/BlogListingShell";

export const metadata = { title: "Guides & Conseils | Nova" };

export default function BlogGuidesPage() {
  return (
    <BlogListingShell
      title="Guides & Conseils"
      subtitle="Guides pratiques, tendances et conseils d'experts pour faire les bons choix."
      apiQuery="categories=Guide d'achat,Conseils,Tendances"
      activeTab="/blog/guides"
      emptyMessage="Aucun guide pour l'instant."
    />
  );
}
