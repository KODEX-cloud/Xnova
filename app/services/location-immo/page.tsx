import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export const metadata = {
  title: "Location immobilier — NOVA Services",
  description: "Gestion locative clé en main à Abidjan. Nous trouvons vos locataires et gérons tout pour vous.",
};

export default function LocationImmoPage() {
  return <ServiceDetailPage serviceId="location-immo" />;
}
