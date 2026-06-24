import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  const base = process.env.NEXTAUTH_URL || "https://nova.ci";

  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /publier/

Sitemap: ${base}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
