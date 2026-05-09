import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Location de voiture — NOVA Services",
  description: "Louez une voiture premium à Abidjan. BMW, Mercedes, Range Rover disponibles avec ou sans chauffeur.",
};

export default function LocationVoiturePage() {
  return <ServiceDetailPage serviceId="location-voiture" />;
}
