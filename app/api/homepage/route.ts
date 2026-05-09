import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HOMEPAGE_KEYS } from "@/lib/homepage-keys";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: HOMEPAGE_KEYS } },
    });
    const data: Record<string, string> = {};
    rows.forEach((r) => {
      const shortKey = r.key.replace("homepage.", "");
      data[shortKey] = r.value || "";
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: Record<string, string> = await req.json();
    const ops = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key: `homepage.${key}` },
        update: { value: String(value) },
        create: { key: `homepage.${key}`, value: String(value) },
      })
    );
    await prisma.$transaction(ops);
    revalidatePath("/", "page");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Save error" }, { status: 500 });
  }
}
