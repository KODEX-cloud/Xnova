import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { FileText } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "cgu" } }).catch(() => null);
  return {
    title: page?.seoTitle || "Conditions générales d'utilisation — NOVA",
    description: page?.metaDescription || "Consultez les conditions générales d'utilisation de NOVA Marketplace.",
  };
}

const DEFAULT_CONTENT = `
## 1. Objet

Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme NOVA Marketplace, accessible à l'adresse nova.ci.

## 2. Acceptation des conditions

En utilisant NOVA Marketplace, vous acceptez l'ensemble des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.

## 3. Inscription et compte

Pour publier des annonces, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.

## 4. Publication d'annonces

Les annonces publiées doivent être légales, exactes et correspondre à des biens ou services réels. NOVA se réserve le droit de supprimer toute annonce non conforme à ses règles.

## 5. Contenu interdit

Il est strictement interdit de publier : des annonces frauduleuses, des contenus illicites, des informations personnelles de tiers sans leur consentement.

## 6. Responsabilité

NOVA Marketplace agit en tant qu'intermédiaire entre acheteurs et vendeurs. Nous ne sommes pas responsables des transactions effectuées entre utilisateurs.

## 7. Propriété intellectuelle

Le contenu de la plateforme (logos, design, textes) est protégé par le droit de la propriété intellectuelle et appartient à NOVA Marketplace.

## 8. Modification des CGU

NOVA se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur la plateforme.

## 9. Contact

Pour toute question : contact@nova.ci
`;

export default async function CguPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "page.cgu." } },
  }).catch(() => []);
  const config = Object.fromEntries(settings.map(s => [s.key.replace("page.cgu.", ""), s.value]));
  const content = config["content"] || DEFAULT_CONTENT;

  const paragraphs = content.split("\n").filter((l) => l.trim());

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-5">
            <FileText className="h-3.5 w-3.5" />
            Légal
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Conditions générales d&apos;utilisation</h1>
          <p className="text-white/60 text-sm">Dernière mise à jour : juin 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          {paragraphs.map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-gray-900 font-bold text-xl mt-8 mb-3 first:mt-0">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="text-gray-600 text-sm ml-4 mb-1">{line.replace("- ", "")}</li>;
            }
            return <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{line}</p>;
          })}
        </div>
      </div>
    </main>
  );
}
