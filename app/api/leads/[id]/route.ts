import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission((session.user as any).role, "AGENT_AUTO")) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { assignedTo: { select: { id: true, name: true, email: true, avatar: true } } },
  });
  if (!lead) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission((session.user as any).role, "AGENT_AUTO")) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { pipelineStatus, priority, notes, expectedValue, assignedToId, isRead } = body;

  const coreUpdate: any = {};
  if (isRead !== undefined) coreUpdate.isRead = isRead;

  const crmUpdate: any = {};
  if (pipelineStatus !== undefined) crmUpdate.pipelineStatus = pipelineStatus;
  if (priority !== undefined)       crmUpdate.priority       = priority;
  if (notes !== undefined)          crmUpdate.notes          = notes;
  if (expectedValue !== undefined)  crmUpdate.expectedValue  = expectedValue;
  if (assignedToId !== undefined)   crmUpdate.assignedToId   = assignedToId || null;

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { ...coreUpdate, ...crmUpdate },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(lead);
  } catch {
    const lead = await prisma.lead.update({ where: { id }, data: coreUpdate });
    return NextResponse.json({ ...lead, ...crmUpdate });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !hasPermission((session.user as any).role, "ADMIN")) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}