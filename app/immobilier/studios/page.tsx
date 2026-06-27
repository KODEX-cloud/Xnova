import ListingShell from "@/components/immobilier/ListingShell";

export const metadata = {
  title: "Studios meublés — NOVA Immobilier",
  description: "Louez un studio meublé à Abidjan. Emménagez immédiatement dans nos studios tout équipés.",
};

export default function StudiosPage() {
  return (
    <ListingShell
      title="Studios meublés"
      subtitle="Studios tout équipés pour emménager immédiatement. Idéal pour les professionnels et étudiants à Abidjan."
      badge="Studios meublés"
      apiQuery="type=STUDIO"
      emptyMessage="Aucun studio disponible actuellement."
      accentColor="emerald"
    />
  );
}
