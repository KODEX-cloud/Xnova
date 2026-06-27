import CarListingShell from "@/components/automobile/CarListingShell";

export const metadata = { title: "Vente de voitures | Nova" };

export default function AutoVentePage() {
  return (
    <CarListingShell
      title="Voitures à vendre"
      subtitle="BMW, Mercedes, Toyota, Range Rover et bien plus — trouvez votre prochain véhicule chez NOVA."
      apiQuery="priceType=SALE"
      activeTab="/automobile/vente"
      badge="Vente Automobile"
      emptyMessage="Aucun véhicule à vendre pour l'instant."
    />
  );
}
