import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL?.replace("http://localhost:4000", "https://nova.ci") || "https://nova.ci";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/dashboard/", "/paiement/", "/publier/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}