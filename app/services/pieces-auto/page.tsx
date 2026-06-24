import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getPageSeo } from "@/lib/get-page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services/pieces-auto", {
    title: "Vente de pièces auto — NOVA Services",
    description: "Pièces automobiles neuves et d'occasion pour toutes marques. Livraison rapide sur Abidjan.",
  });
}

export default function PiecesAutoPage() {
  return <ServiceDetailPage serviceId="pieces-auto" />;
}
