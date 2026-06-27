import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.DEPLOY_WEBHOOK_SECRET;
const HOSTINGER_WEBHOOK = process.env.HOSTINGER_DEPLOY_WEBHOOK;

export async function GET() {
  return NextResponse.json({
    status: "ok",
    pipeline: "NOVA Deployment Pipeline",
    version: "1.0.0",
    webhookConfigured: !!HOSTINGER_WEBHOOK,
    lastDeploy: process.env.VERCEL_GIT_COMMIT_SHA || "local",
  });
}

export async function POST(req: NextRequest) {
  // Accept from: 1) Admin session, 2) Webhook secret header
  const webhookKey = req.headers.get("x-deploy-secret");
  const isWebhook  = WEBHOOK_SECRET && webhookKey === WEBHOOK_SECRET;

  if (!isWebhook) {
    const session = await getServerSession(authOptions);
    if (!session || !["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }
  }

  const body = await req.json().catch(() => ({}));
  const { action = "deploy", paths = [] } = body;

  const results: Record<string, string> = {};

  // Revalidate ISR paths
  if (action === "revalidate" || action === "deploy") {
    const toRevalidate = paths.length > 0 ? paths : ["/", "/automobile", "/immobilier", "/blog", "/annonces", "/services", "/about"];
    for (const p of toRevalidate) {
      try { revalidatePath(p); results[p] = "revalidated"; }
      catch { results[p] = "error"; }
    }
  }

  // Trigger Hostinger deploy webhook
  if ((action === "deploy" || action === "push") && HOSTINGER_WEBHOOK) {
    try {
      const res = await fetch(HOSTINGER_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref: "refs/heads/main" }) });
      results["hostinger"] = res.ok ? "triggered" : `error:${res.status}`;
    } catch (e: any) {
      results["hostinger"] = "unreachable:" + e.message;
    }
  }

  return NextResponse.json({
    ok: true,
    action,
    results,
    timestamp: new Date().toISOString(),
  });
}