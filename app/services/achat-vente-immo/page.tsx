import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getPageSeo } from "@/lib/get-page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services/achat-vente-immo", {
    title: "Achat & Vente immobilier — NOVA Services",
    description: "Accompagnement complet pour l'achat ou la vente de votre bien immobilier à Abidjan.",
  });
}

export default function AchatVenteImmoPage() {
  return <ServiceDetailPage serviceId="achat-vente-immo" />;
}
