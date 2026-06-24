import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Shield } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "confidentialite" } }).catch(() => null);
  return {
    title: page?.seoTitle || "Politique de confidentialité — NOVA",
    description: page?.metaDescription || "Consultez notre politique de confidentialité et la gestion de vos données personnelles.",
  };
}

const DEFAULT_CONTENT = `
## 1. Collecte des données

NOVA Marketplace collecte les informations que vous nous fournissez directement lors de la création de votre compte, la publication d'annonces ou l'utilisation de nos services.

## 2. Utilisation des données

Vos données sont utilisées pour :
- Gérer votre compte et vos annonces
- Vous mettre en relation avec d'autres utilisateurs
- Améliorer nos services
- Vous envoyer des communications relatives à votre activité

## 3. Partage des données

Nous ne vendons jamais vos données personnelles à des tiers. Vos coordonnées ne sont partagées qu'avec les utilisateurs que vous choisissez de contacter.

## 4. Sécurité

Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.

## 5. Vos droits

Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous à contact@nova.ci pour exercer ces droits.

## 6. Cookies

Nous utilisons des cookies pour améliorer votre expérience de navigation. Vous pouvez les désactiver dans les paramètres de votre navigateur.

## 7. Contact

Pour toute question relative à cette politique, contactez : contact@nova.ci
`;

export default async function ConfidentialitePage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "page.confidentialite." } },
  }).catch(() => []);
  const config = Object.fromEntries(settings.map(s => [s.key.replace("page.confidentialite.", ""), s.value]));
  const content = config["content"] || DEFAULT_CONTENT;

  const paragraphs = content.split("\n").filter((l) => l.trim());

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-5">
            <Shield className="h-3.5 w-3.5" />
            Légal
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Politique de confidentialité</h1>
          <p className="text-white/60 text-sm">Dernière mise à jour : juin 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 prose prose-gray max-w-none">
          {paragraphs.map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-gray-900 font-bold text-xl mt-8 mb-3 first:mt-0">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="text-gray-600 text-sm ml-4">{line.replace("- ", "")}</li>;
            }
            return <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{line}</p>;
          })}
        </div>
      </div>
    </main>
  );
}
