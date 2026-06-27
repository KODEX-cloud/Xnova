import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });

  const userId = (session.user as any).id as string;

  // Try extended profile (requires migration to have run)
  try {
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { id: true, name: true, email: true, phone: true, userType: true, role: true,
                avatar: true, bio: true, company: true, city: true, website: true,
                facebook: true, instagram: true, twitter: true, linkedin: true, whatsapp: true,
                subscriptionPlan: true, subscriptionExpiresAt: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    // Extended columns not migrated yet — return base profile
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { id: true, name: true, email: true, phone: true, userType: true, role: true,
                avatar: true, subscriptionPlan: true, subscriptionExpiresAt: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    return NextResponse.json(user);
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifie" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const body   = await req.json();
  const { name, phone, userType, currentPassword, newPassword,
    bio, company, city, website, avatar,
    facebook, instagram, twitter, linkedin, whatsapp } = body;

  // Always available fields
  const coreData: any = {};
  if (name !== undefined)     coreData.name     = name;
  if (phone !== undefined)    coreData.phone    = phone;
  if (userType !== undefined) coreData.userType = userType;
  if (avatar !== undefined)   coreData.avatar   = avatar;

  // Extended fields (post-migration)
  const extData: any = {};
  if (bio !== undefined)       extData.bio       = bio;
  if (company !== undefined)   extData.company   = company;
  if (city !== undefined)      extData.city      = city;
  if (website !== undefined)   extData.website   = website;
  if (facebook !== undefined)  extData.facebook  = facebook;
  if (instagram !== undefined) extData.instagram = instagram;
  if (twitter !== undefined)   extData.twitter   = twitter;
  if (linkedin !== undefined)  extData.linkedin  = linkedin;
  if (whatsapp !== undefined)  extData.whatsapp  = whatsapp;

  // Password change
  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Mot de passe actuel requis" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    coreData.password = await bcrypt.hash(newPassword, 12);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data:  { ...coreData, ...extData },
      select: { id: true, name: true, email: true, phone: true, userType: true, role: true },
    });
    return NextResponse.json(updated);
  } catch {
    // Extended columns not migrated — update core only
    const updated = await prisma.user.update({
      where: { id: userId },
      data:  coreData,
      select: { id: true, name: true, email: true, phone: true, userType: true, role: true },
    });
    return NextResponse.json(updated);
  }
}