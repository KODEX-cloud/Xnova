import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(role);
  const invoices = await prisma.invoice.findMany({
    where: isAdmin ? {} : { userId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const role = (session.user as any).role;
  if (!["SUPER_ADMIN", "ADMIN"].includes(role)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const body = await req.json();
  const { userId, amount, tax = 0, description, paymentId } = body;
  const total = amount + tax;
  const count = await prisma.invoice.count();
  const number = `NOVA-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
  const invoice = await prisma.invoice.create({
    data: { number, userId, amount, tax, total, description, paymentId, status: "PAID" },
  });
  return NextResponse.json(invoice, { status: 201 });
}
