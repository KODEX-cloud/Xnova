import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Vente de pièces auto — NOVA Services",
  description: "Pièces automobiles neuves et d'occasion pour toutes marques. Livraison rapide sur Abidjan.",
};

export default function PiecesAutoPage() {
  return <ServiceDetailPage serviceId="pieces-auto" />;
}
