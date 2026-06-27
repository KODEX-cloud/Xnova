import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map(r => headers.map(h => escape(r[h])).join(",")),
  ].join("\n");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !ADMIN_ROLES.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "users";

  let rows: Record<string, unknown>[] = [];
  let filename = `nova-export-${type}-${new Date().toISOString().slice(0, 10)}`;

  switch (type) {
    case "users":
      rows = (await prisma.user.findMany({
        select: { id: true, name: true, email: true, phone: true, role: true, userType: true, subscriptionPlan: true, isActive: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })).map(u => ({ ...u, createdAt: u.createdAt.toISOString() }));
      break;

    case "payments":
      rows = (await prisma.payment.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      })).map(p => ({ id: p.id, reference: p.reference, user: p.user?.name || "", email: p.user?.email || "", amount: p.amount, currency: p.currency, method: p.method, status: p.status, type: p.type, planType: p.planType || "", createdAt: p.createdAt.toISOString() }));
      break;

    case "leads":
      rows = (await prisma.lead.findMany({
        include: { assignedTo: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      })).map(l => ({ id: l.id, type: l.type, name: l.name || "", email: l.email || "", phone: l.phone || "", subject: l.subject || "", message: l.message || "", pipelineStatus: l.pipelineStatus, priority: l.priority, assignedTo: l.assignedTo?.name || "", createdAt: l.createdAt.toISOString() }));
      break;

    case "listings":
      const [cars, props] = await Promise.all([
        prisma.car.findMany({ select: { id: true, title: true, price: true, status: true, city: true, views: true, isBoosted: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
        prisma.property.findMany({ select: { id: true, title: true, price: true, status: true, city: true, views: true, isBoosted: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
      ]);
      rows = [
        ...cars.map(c => ({ ...c, type: "CAR", createdAt: c.createdAt.toISOString() })),
        ...props.map(p => ({ ...p, type: "PROPERTY", createdAt: p.createdAt.toISOString() })),
      ];
      break;

    default:
      return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  }

  const csv = toCSV(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
