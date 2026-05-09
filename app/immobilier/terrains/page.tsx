import ListingShell from "@/components/immobilier/ListingShell";

export const metadata = {
  title: "Vente de terrains — NOVA Immobilier",
  description: "Achetez un terrain à bâtir à Abidjan et en Côte d'Ivoire. Terrains viabilisés, lotis et constructibles.",
};

export default function TerrainsPage() {
  return (
    <ListingShell
      title="Terrains à vendre"
      subtitle="Terrains viabilisés et constructibles à Abidjan et en Côte d'Ivoire. Investissez dans le foncier dès aujourd'hui."
      badge="Terrains disponibles"
      apiQuery="type=LAND"
      emptyMessage="Aucun terrain disponible actuellement."
      accentColor="amber"
    />
  );
}
