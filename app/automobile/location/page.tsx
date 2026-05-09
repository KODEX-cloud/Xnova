import CarListingShell from "@/components/automobile/CarListingShell";

export const metadata = { title: "Location de voitures | Nova" };

export default function AutoLocationPage() {
  return (
    <CarListingShell
      title="Location de voitures"
      subtitle="Courte et longue durée, avec ou sans chauffeur — des véhicules premium disponibles à Abidjan."
      apiQuery="priceType=RENT"
      activeTab="/automobile/location"
      badge="Location Automobile"
      emptyMessage="Aucun véhicule en location pour l'instant."
    />
  );
}
