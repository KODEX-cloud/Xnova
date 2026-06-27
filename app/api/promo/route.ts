import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, amount } = await req.json();
  if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });
  const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
  if (!promo || !promo.isActive) return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 404 });
  if (promo.validUntil && new Date() > promo.validUntil) return NextResponse.json({ error: "Code expiré" }, { status: 400 });
  if (promo.maxUses && promo.usedCount >= promo.maxUses) return NextResponse.json({ error: "Code épuisé" }, { status: 400 });
  if (promo.minAmount && amount && amount < promo.minAmount) return NextResponse.json({ error: `Montant minimum: ${promo.minAmount} FCFA` }, { status: 400 });
  const discount = promo.discountType === "PERCENT"
    ? Math.round((amount || 0) * promo.discountValue / 100)
    : promo.discountValue;
  return NextResponse.json({ valid: true, discount, discountType: promo.discountType, discountValue: promo.discountValue, description: promo.description });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const role = (session.user as any).role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const codes = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}
