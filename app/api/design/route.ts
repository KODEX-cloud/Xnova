import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DESIGN_KEYS } from "@/lib/design-keys";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: DESIGN_KEYS } },
    });
    const result: Record<string, string> = {};
    rows.forEach((r) => {
      const k = r.key.replace("design.", "");
      result[k] = r.value || "";
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body: Record<string, string> = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key: `design.${key}` },
        update: { value: String(value) },
        create: { key: `design.${key}`, value: String(value) },
      })
    )
  );

  // Revalidate all frontend pages so next request gets fresh CSS
  try {
    revalidatePath("/", "layout");
  } catch {
    // Revalidation not critical
  }

  return NextResponse.json({ ok: true });
}
