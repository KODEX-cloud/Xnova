#!/usr/bin/env node
/**
 * NOVA Business Migration Engine
 * Executes versioned business migrations in order.
 * State tracked in: prisma/business-migrations/
 * DB table: BusinessMigration (if migrated) — fallback to .migration-state.json
 *
 * Usage:
 *   node scripts/business-migrate.js           # Run pending migrations
 *   node scripts/business-migrate.js --list    # List migrations + status
 *   node scripts/business-migrate.js --rollback 001  # Rollback specific version
 */

const { PrismaClient } = require("@prisma/client");
const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT       = path.resolve(__dirname, "..");
const MIGRATIONS = path.join(ROOT, "prisma", "business-migrations");
const STATE_FILE = path.join(ROOT, ".migration-state.json");
const prisma     = new PrismaClient();

// ── Utilities ──────────────────────────────────────────────────────────────────
const log  = (msg) => console.log(`[BIZ-MIGRATE] ${msg}`);
const checksum = (content) => crypto.createHash("md5").update(content).digest("hex");

// ── State management ───────────────────────────────────────────────────────────
async function getApplied() {
  // Try DB first
  try {
    const rows = await prisma.businessMigration.findMany({
      where:   { status: "APPLIED" },
      select:  { version: true },
    });
    return new Set(rows.map(r => r.version));
  } catch {
    // Fallback to file
    if (fs.existsSync(STATE_FILE)) {
      return new Set(JSON.parse(fs.readFileSync(STATE_FILE, "utf8")).applied || []);
    }
    return new Set();
  }
}

async function markApplied(version, name, duration, csum) {
  // Try DB
  try {
    await prisma.businessMigration.upsert({
      where:  { version },
      update: { status: "APPLIED", appliedAt: new Date(), duration },
      create: { version, name, status: "APPLIED", appliedAt: new Date(), duration, checksum: csum },
    });
  } catch {}
  // Always write file
  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : { applied: [] };
  if (!state.applied.includes(version)) state.applied.push(version);
  state[version] = { name, appliedAt: new Date().toISOString(), duration };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function markFailed(version, name, error) {
  try {
    await prisma.businessMigration.upsert({
      where:  { version },
      update: { status: "FAILED", error: error.slice(0, 500) },
      create: { version, name, status: "FAILED", error: error.slice(0, 500) },
    });
  } catch {}
}

// ── Migration loader ───────────────────────────────────────────────────────────
function loadMigrations() {
  if (!fs.existsSync(MIGRATIONS)) return [];
  return fs.readdirSync(MIGRATIONS)
    .filter(f => f.endsWith(".js") && /^\d{3}/.test(f))
    .sort()
    .map(f => ({
      file:    f,
      version: f.match(/^(\d{3})/)[1],
      name:    f.replace(/\.js$/, ""),
      path:    path.join(MIGRATIONS, f),
      content: fs.readFileSync(path.join(MIGRATIONS, f), "utf8"),
    }));
}

// ── Run migrations ─────────────────────────────────────────────────────────────
async function runPending() {
  const migrations = loadMigrations();
  const applied    = await getApplied();
  const pending    = migrations.filter(m => !applied.has(m.version));
  
  if (pending.length === 0) {
    log("No pending business migrations.");
    return;
  }
  
  log(`Found ${pending.length} pending migration(s).`);
  
  for (const m of pending) {
    log(`Applying ${m.version}: ${m.name}...`);
    const start = Date.now();
    
    try {
      const mod = require(m.path);
      if (typeof mod.up === "function") {
        await mod.up(prisma);
      } else if (typeof mod === "function") {
        await mod(prisma);
      } else {
        throw new Error("Migration must export an 'up' function or a default function");
      }
      
      const duration = Date.now() - start;
      await markApplied(m.version, m.name, duration, checksum(m.content));
      log(`  Applied in ${duration}ms`);
    } catch (e) {
      await markFailed(m.version, m.name, e.message);
      log(`  FAILED: ${e.message}`);
      throw e;
    }
  }
  
  log(`All migrations applied.`);
}

// ── List migrations ────────────────────────────────────────────────────────────
async function listMigrations() {
  const migrations = loadMigrations();
  const applied    = await getApplied();
  
  console.log("\nBusiness Migrations:");
  console.log("=".repeat(60));
  for (const m of migrations) {
    const status = applied.has(m.version) ? "APPLIED" : "PENDING";
    console.log(`  [${status}] ${m.version} — ${m.name}`);
  }
  if (migrations.length === 0) console.log("  (no migrations found)");
  console.log("=".repeat(60) + "\n");
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes("--list")) {
      await listMigrations();
    } else {
      await runPending();
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => { console.error("[BIZ-MIGRATE] Fatal:", e.message); process.exit(1); });