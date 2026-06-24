import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import DynamicStyles from "@/components/DynamicStyles";
import prisma from "@/lib/prisma";
import Script from "next/script";

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

async function getAnalyticsIds() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["googleAnalyticsId", "googleTagManagerId", "facebookPixelId"] } },
    });
    const map: Record<string, string> = {};
    rows.forEach(r => { map[r.key] = r.value || ""; });
    return map;
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analytics = await getAnalyticsIds();
  const gaId = analytics["googleAnalyticsId"];
  const gtmId = analytics["googleTagManagerId"];
  const fbPixelId = analytics["facebookPixelId"];

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
        {/* Google Tag Manager */}
        {gtmId && (
          <Script id="gtm-head" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}</Script>
        )}
        {/* Google Analytics 4 */}
        {gaId && !gtmId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}
        {/* Facebook Pixel */}
        {fbPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </head>
      <body className="antialiased">
        {gtmId && (
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{display:"none",visibility:"hidden"}} /></noscript>
        )}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
