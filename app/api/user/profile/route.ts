import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where:  { id: (session.user as any).id },
    select: { id: true, name: true, email: true, phone: true, userType: true, role: true, avatar: true, subscriptionPlan: true, subscriptionExpiresAt: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const body   = await req.json();
  const { name, phone, userType, currentPassword, newPassword } = body;

  const updateData: any = {};
  if (name)     updateData.name     = name;
  if (phone)    updateData.phone    = phone;
  if (userType) updateData.userType = userType;

  // Password change
  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where:  { id: userId },
    data:   updateData,
    select: { id: true, name: true, email: true, phone: true, userType: true, role: true },
  });

  return NextResponse.json(updated);
}
