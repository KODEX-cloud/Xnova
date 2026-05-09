import ListingShell from "@/components/immobilier/ListingShell";

export const metadata = {
  title: "Biens immobiliers à vendre — NOVA",
  description: "Achetez votre villa, maison, appartement ou terrain à Abidjan. Sélection premium de biens immobiliers à vendre en Côte d'Ivoire.",
};

export default function ImmoVentePage() {
  return (
    <ListingShell
      title="Biens à vendre"
      subtitle="Villas, maisons, appartements, terrains — trouvez votre propriété idéale avec NOVA."
      badge="Achat Immobilier"
      apiQuery="priceType=SALE"
      emptyMessage="Aucun bien en vente pour l'instant."
      accentColor="red"
    />
  );
}
