import { NextRequest, NextResponse } from "next/server";
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

  // SQL migrations (from filesystem)
  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const sqlMigrations: any[] = [];
  try {
    const dirs = fs.readdirSync(migrationsDir).filter(d => /^\d{14}/.test(d));
    for (const dir of dirs) {
      const sqlFile = path.join(migrationsDir, dir, "migration.sql");
      if (fs.existsSync(sqlFile)) {
        const stat = fs.statSync(sqlFile);
        sqlMigrations.push({ name: dir, size: stat.size, type: "SQL" });
      }
    }
  } catch {}

  // Business migrations (from DB + filesystem)
  const bizDir = path.join(process.cwd(), "prisma", "business-migrations");
  const bizFiles: string[] = [];
  try { bizFiles.push(...fs.readdirSync(bizDir).filter(f => f.endsWith(".js") && /^\d{3}/.test(f)).sort()); }
  catch {}

  let bizApplied: string[] = [];
  try {
    const rows = await (prisma as any).businessMigration.findMany({
      where: { status: "APPLIED" },
      orderBy: { version: "asc" },
    });
    bizApplied = rows.map((r: any) => r.version);
  } catch {
    const stateFile = path.join(process.cwd(), ".migration-state.json");
    if (fs.existsSync(stateFile)) {
      bizApplied = JSON.parse(fs.readFileSync(stateFile, "utf8")).applied || [];
    }
  }

  const businessMigrations = bizFiles.map(f => ({
    name:    f.replace(/\.js$/, ""),
    version: f.match(/^(\d{3})/)?.[1] || "",
    status:  bizApplied.includes(f.match(/^(\d{3})/)?.[1] || "") ? "APPLIED" : "PENDING",
    type:    "BUSINESS",
  }));

  // Prisma migration history from DB (_prisma_migrations table)
  let prismaHistory: any[] = [];
  try {
    prismaHistory = await prisma.$queryRaw`SELECT id, migration_name, finished_at, applied_steps_count FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 20` as any[];
  } catch {}

  return NextResponse.json({
    sql:      sqlMigrations,
    business: businessMigrations,
    prisma:   prismaHistory,
    pending:  {
      sql:      0, // Can only tell via migrate status command
      business: businessMigrations.filter(m => m.status === "PENDING").length,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "SUPER_ADMIN requis" }, { status: 403 });
  }

  const { action, version } = await req.json();

  if (action === "run-business") {
    // Trigger business migration engine via API (limited — runs in process)
    try {
      const { execSync } = require("child_process");
      execSync("node scripts/business-migrate.js", { cwd: process.cwd(), timeout: 30000 });
      return NextResponse.json({ ok: true, message: "Business migrations applied" });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}