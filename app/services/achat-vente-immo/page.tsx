import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Achat & Vente immobilier — NOVA Services",
  description: "Accompagnement complet pour l'achat ou la vente de votre bien immobilier à Abidjan.",
};

export default function AchatVenteImmoPage() {
  return <ServiceDetailPage serviceId="achat-vente-immo" />;
}
