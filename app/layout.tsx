import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import DynamicStyles from "@/components/DynamicStyles";

export const metadata: Metadata = {
  title: "NOVA - Marketplace Premium Automobile & Immobilier en Côte d'Ivoire",
  description:
    "NOVA est votre partenaire premium en automobile et immobilier en Côte d'Ivoire. Vente, location de voitures et propriétés à Abidjan et partout en Côte d'Ivoire.",
  keywords:
    "automobile, immobilier, Côte d'Ivoire, Abidjan, voiture, villa, appartement, location, vente",
  authors: [{ name: "NOVA Marketplace" }],
  openGraph: {
    title: "NOVA - Marketplace Premium Automobile & Immobilier",
    description:
      "Votre Partenaire Premium en Automobile & Immobilier en Côte d'Ivoire",
    type: "website",
    locale: "fr_CI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply theme class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nova-theme');var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)||(t!=='light'&&t!=='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light');}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <DynamicStyles />
      </head>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
