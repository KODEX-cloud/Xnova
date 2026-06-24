import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getPageSeo } from "@/lib/get-page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo("services/location-voiture", {
    title: "Location de voiture — NOVA Services",
    description: "Louez une voiture premium à Abidjan. BMW, Mercedes, Range Rover disponibles avec ou sans chauffeur.",
  });
}

export default function LocationVoiturePage() {
  return <ServiceDetailPage serviceId="location-voiture" />;
}
