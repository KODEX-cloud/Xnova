import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix");

  const settings = await prisma.siteSetting.findMany({
    where: prefix ? { key: { startsWith: prefix } } : undefined,
  });

  const obj: Record<string, string> = {};
  settings.forEach((s) => {
    if (s.value) {
      // Strip prefix from key when filtering so consumers get clean keys
      const k = prefix ? s.key.replace(prefix, "") : s.key;
      obj[k] = s.value;
    }
  });
  return NextResponse.json(obj);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
