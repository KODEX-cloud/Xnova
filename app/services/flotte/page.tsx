import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Gestion de flotte — NOVA Services",
  description: "Confiez la gestion complète de votre flotte de véhicules à NOVA. Suivi, maintenance, optimisation des coûts.",
};

export default function FlottePage() {
  return <ServiceDetailPage serviceId="flotte" />;
}
