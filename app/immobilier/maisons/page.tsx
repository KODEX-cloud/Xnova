import ListingShell from "@/components/immobilier/ListingShell";

export const metadata = {
  title: "Vente de maisons — NOVA Immobilier",
  description: "Achetez votre villa, maison ou appartement à Abidjan. Sélection premium de biens immobiliers à vendre en Côte d'Ivoire.",
};

export default function MaisonsPage() {
  return (
    <ListingShell
      title="Maisons & Villas à vendre"
      subtitle="Trouvez la propriété de vos rêves — villas, maisons modernes, appartements et duplexes à Abidjan et alentours."
      badge="Vente immobilière"
      apiQuery="types=VILLA,HOUSE,APARTMENT&priceType=SALE"
      emptyMessage="Aucune maison disponible pour la vente."
      accentColor="red"
    />
  );
}
