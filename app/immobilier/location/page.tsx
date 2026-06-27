import ListingShell from "@/components/immobilier/ListingShell";

export const metadata = {
  title: "Biens immobiliers en location — NOVA",
  description: "Louez votre maison, appartement ou studio à Abidjan. Longue et courte durée disponibles en Côte d'Ivoire.",
};

export default function ImmoLocationPage() {
  return (
    <ListingShell
      title="Biens en location"
      subtitle="Maisons, appartements, studios meublés — trouvez votre logement idéal à Abidjan."
      badge="Location Immobilier"
      apiQuery="priceType=RENT"
      emptyMessage="Aucun bien en location pour l'instant."
      accentColor="emerald"
    />
  );
}
