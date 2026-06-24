import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getPageSeo } from "@/lib/get-page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services/location-immo", {
    title: "Location immobilier — NOVA Services",
    description: "Gestion locative clé en main à Abidjan. Nous trouvons vos locataires et gérons tout pour vous.",
  });
}

export default function LocationImmoPage() {
  return <ServiceDetailPage serviceId="location-immo" />;
}
