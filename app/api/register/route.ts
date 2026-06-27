import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RegisterSchema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  phone:    z.string().min(8).max(20).optional(),
  password: z.string().min(8),
  userType: z.enum(["VENDEUR", "AGENCE"]).default("VENDEUR"),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(getRateLimitKey(req, "register"), 5, 15 * 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }, { status: 429 });
  }
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name:     data.name,
        email:    data.email,
        phone:    data.phone,
        password: hashed,
        userType: data.userType,
        role:     "USER",
        subscriptionPlan: "FREE",
      },
      select: { id: true, email: true, name: true, role: true, userType: true },
    });

    // Create initial FREE subscription record
    await prisma.subscription.create({
      data: {
        userId:   user.id,
        plan:     "FREE",
        status:   "ACTIVE",
        startsAt: new Date(),
        expiresAt: null,
      },
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name || "").catch(() => {});

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return NextResponse.json({ error: "Données invalides", details: e.errors }, { status: 422 });
    }
    console.error("[REGISTER]", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
