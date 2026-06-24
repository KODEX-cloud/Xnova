import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getPageSeo } from "@/lib/get-page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services/flotte", {
    title: "Gestion de flotte — NOVA Services",
    description: "Confiez la gestion complète de votre flotte de véhicules à NOVA. Suivi, maintenance, optimisation des coûts.",
  });
}

export default function FlottePage() {
  return <ServiceDetailPage serviceId="flotte" />;
}
