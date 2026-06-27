import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 });
  }

  const root = process.cwd();

  // ── Git status ──────────────────────────────────────────────────────────────
  const gitStatus: any = { status: "unknown", branch: "main", hash: null };
  try {
    const rollbackFile = path.join(root, ".rollback");
    if (fs.existsSync(rollbackFile)) {
      const rb = JSON.parse(fs.readFileSync(rollbackFile, "utf8"));
      gitStatus.hash       = rb.hash;
      gitStatus.branch     = rb.branch;
      gitStatus.rollbackAt = rb.timestamp;
      gitStatus.status     = "ok";
    }
    const logFile = path.join(root, ".pipeline.log");
    if (fs.existsSync(logFile)) {
      const logLines = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean);
      gitStatus.lastPipelineRun = logLines.at(-1) || null;
    }
  } catch {}

  // ── DB status ───────────────────────────────────────────────────────────────
  const dbStatus: any = { status: "unknown", tables: [], pendingMigrations: 0 };
  try {
    const [userCount, carCount, propCount] = await Promise.all([
      prisma.user.count(),
      prisma.car.count(),
      prisma.property.count(),
    ]);
    dbStatus.status = "connected";
    dbStatus.counts = { users: userCount, cars: carCount, properties: propCount };
    
    // Check for pending migrations via filesystem
    const bizDir  = path.join(root, "prisma", "business-migrations");
    const stateFile = path.join(root, ".migration-state.json");
    const bizFiles  = fs.existsSync(bizDir) ? fs.readdirSync(bizDir).filter(f => f.endsWith(".js") && /^\d{3}/.test(f)) : [];
    const applied   = fs.existsSync(stateFile) ? (JSON.parse(fs.readFileSync(stateFile, "utf8")).applied || []) : [];
    dbStatus.pendingMigrations = bizFiles.filter(f => !applied.includes(f.match(/^(\d{3})/)?.[1] || "")).length;
  } catch (e: any) {
    dbStatus.status = "error";
    dbStatus.error  = e.message?.slice(0, 100);
  }

  // ── Build status ─────────────────────────────────────────────────────────────
  const buildStatus: any = { status: "unknown" };
  try {
    const buildDir = path.join(root, ".next");
    if (fs.existsSync(buildDir)) {
      const buildManifest = path.join(buildDir, "build-manifest.json");
      if (fs.existsSync(buildManifest)) {
        const stat = fs.statSync(buildManifest);
        buildStatus.status   = "built";
        buildStatus.builtAt  = stat.mtime.toISOString();
        buildStatus.cacheDir = fs.existsSync(path.join(buildDir, "cache"));
      } else {
        buildStatus.status = "no-build";
      }
    } else {
      buildStatus.status = "no-build";
    }
  } catch {}

  // ── Deploy report ────────────────────────────────────────────────────────────
  const deployStatus: any = { status: "unknown", lastReport: null };
  try {
    const reportFile = path.join(root, "DEPLOY_REPORT.md");
    if (fs.existsSync(reportFile)) {
      const content = fs.readFileSync(reportFile, "utf8");
      const dateMatch = content.match(/\*\*Date:\*\* (.+)/);
      const resultMatch = content.includes("Pipeline completed successfully");
      deployStatus.status     = resultMatch ? "success" : "failed";
      deployStatus.lastReport = dateMatch?.[1] || null;
    }
  } catch {}

  // ── Environment check ────────────────────────────────────────────────────────
  const envCheck = {
    database:    !!process.env.DATABASE_URL,
    nextauth:    !!process.env.NEXTAUTH_SECRET,
    resend:      !!process.env.RESEND_API_KEY,
    cinetpay:    !!(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID),
    adminEmail:  !!process.env.ADMIN_EMAIL,
    deployHook:  !!process.env.HOSTINGER_DEPLOY_WEBHOOK,
  };

  // ── Pending SQL migrations ────────────────────────────────────────────────────
  const sqlMigrations: any[] = [];
  try {
    const migrDir = path.join(root, "prisma", "migrations");
    if (fs.existsSync(migrDir)) {
      const dirs = fs.readdirSync(migrDir).filter(d => /^\d{14}/.test(d));
      dirs.forEach(d => sqlMigrations.push({ name: d, file: `prisma/migrations/${d}/migration.sql` }));
    }
  } catch {}

  // ── Business migration history ───────────────────────────────────────────────
  let bizHistory: any[] = [];
  try {
    bizHistory = await (prisma as any).businessMigration.findMany({
      orderBy: { appliedAt: "desc" }, take: 10,
    });
  } catch {
    const stateFile = path.join(root, ".migration-state.json");
    if (fs.existsSync(stateFile)) {
      const s = JSON.parse(fs.readFileSync(stateFile, "utf8"));
      bizHistory = Object.entries(s).filter(([k]) => k !== "applied")
        .map(([version, info]: any) => ({ version, ...info }));
    }
  }

  return NextResponse.json({
    timestamp:  new Date().toISOString(),
    git:        gitStatus,
    db:         dbStatus,
    build:      buildStatus,
    deploy:     deployStatus,
    env:        envCheck,
    migrations: { sql: sqlMigrations, business: bizHistory },
  });
}