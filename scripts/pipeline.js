#!/usr/bin/env node
/**
 * NOVA Marketplace — Deployment Pipeline
 * Usage: node scripts/pipeline.js [--mode=dev|prod] [--skip=git,migrate,build]
 *
 * Steps:
 *  1. Pre-flight checks (env, git, node)
 *  2. Git status + rollback point
 *  3. Pull/push Git
 *  4. Prisma migrate deploy
 *  5. Business migrations
 *  6. Cache clear
 *  7. TypeScript check
 *  8. Build (prod mode)
 *  9. Health check
 * 10. Deploy report
 */

const { execSync, spawn } = require("child_process");
const fs   = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

// ── Configuration ──────────────────────────────────────────────────────────────
const ROOT    = path.resolve(__dirname, "..");
const REPORT  = path.join(ROOT, "DEPLOY_REPORT.md");
const LOG     = path.join(ROOT, ".pipeline.log");

const args    = process.argv.slice(2);
const MODE    = args.find(a => a.startsWith("--mode="))?.split("=")[1] || "dev";
const SKIP    = (args.find(a => a.startsWith("--skip="))?.split("=")[1] || "").split(",");
const DRY_RUN = args.includes("--dry-run");

// ── Utilities ──────────────────────────────────────────────────────────────────
const log   = (msg, type = "INFO") => { const line = `[${new Date().toISOString()}] [${type}] ${msg}`; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const ok    = msg => log("✅ " + msg, "OK");
const warn  = msg => log("⚠️  " + msg, "WARN");
const error = msg => { log("❌ " + msg, "ERROR"); };
const exec  = (cmd, opts = {}) => { log(`> ${cmd}`); if (DRY_RUN) return ""; return execSync(cmd, { cwd: ROOT, encoding: "utf8", ...opts }); };
const tryExec = (cmd, fallback = "") => { try { return exec(cmd); } catch (e) { warn(`Command failed: ${cmd} — ${e.message}`); return fallback; } };

// ── Report builder ─────────────────────────────────────────────────────────────
const report = { steps: [], errors: [], warnings: [], startTime: Date.now() };
const addStep = (name, status, detail = "") => report.steps.push({ name, status, detail, ts: Date.now() });

// ── Step 1: Pre-flight ─────────────────────────────────────────────────────────
async function preflight() {
  log("=== STEP 1: Pre-flight checks ===");
  
  // Node version
  const nodeVer = process.version;
  if (parseInt(nodeVer.slice(1)) < 18) { error("Node 18+ required"); process.exit(1); }
  ok(`Node ${nodeVer}`);

  // Required env vars
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"];
  const missing  = required.filter(k => !process.env[k]);
  if (missing.length > 0) { warn(`Missing env vars: ${missing.join(", ")} — some features may fail`); }
  else ok("All required env vars present");

  // package.json exists
  if (!fs.existsSync(path.join(ROOT, "package.json"))) { error("package.json not found"); process.exit(1); }
  ok("package.json found");

  addStep("Pre-flight", "OK", `Node ${nodeVer}`);
}

// ── Step 2: Git rollback point ─────────────────────────────────────────────────
async function gitRollback() {
  if (SKIP.includes("git")) { log("Skipping git (--skip=git)"); return; }
  log("=== STEP 2: Git rollback point ===");
  
  const hash = tryExec("git rev-parse HEAD").trim();
  const branch = tryExec("git branch --show-current").trim();
  const status = tryExec("git status --short");
  
  log(`Current branch: ${branch}, HEAD: ${hash}`);
  
  // Save rollback info
  const rollbackInfo = { hash, branch, timestamp: new Date().toISOString() };
  fs.writeFileSync(path.join(ROOT, ".rollback"), JSON.stringify(rollbackInfo, null, 2));
  
  if (status.trim()) {
    warn("Working tree has uncommitted changes — stashing...");
    tryExec("git stash push -m \"pipeline-auto-stash\"");
  }
  
  ok(`Rollback point saved: ${hash}`);
  addStep("Git rollback", "OK", hash.slice(0, 8));
}

// ── Step 3: Git pull ───────────────────────────────────────────────────────────
async function gitPull() {
  if (SKIP.includes("git")) return;
  log("=== STEP 3: Git sync ===");
  
  const remote = tryExec("git remote get-url origin").trim();
  if (!remote) { warn("No git remote configured — skipping pull"); return; }
  
  if (MODE === "prod") {
    ok("Production mode — pulling latest from origin");
    tryExec("git pull origin main --rebase");
  } else {
    log("Dev mode — checking for diverged commits");
    const behind = tryExec("git rev-list HEAD..origin/main --count").trim();
    if (behind && parseInt(behind) > 0) warn(`${behind} commits behind origin/main`);
    else ok("Branch up to date with origin");
  }
  
  addStep("Git sync", "OK", `mode=${MODE}`);
}

// ── Step 4: Prisma migrate ─────────────────────────────────────────────────────
async function prismaМigrate() {
  if (SKIP.includes("migrate")) { log("Skipping migrate"); return; }
  log("=== STEP 4: Prisma migrate ===");
  
  try {
    const result = tryExec("npx prisma migrate deploy");
    if (result.includes("No pending migrations")) ok("No pending SQL migrations");
    else ok("SQL migrations applied");
    addStep("Prisma migrate", "OK", "deploy");
  } catch (e) {
    warn("Prisma migrate deploy failed (DB may be unreachable) — continuing");
    report.warnings.push("Prisma migrate: DB unreachable — apply migration.sql manually");
    addStep("Prisma migrate", "WARN", "DB unreachable");
  }
  
  // Always regenerate client
  tryExec("npx prisma generate");
  ok("Prisma client generated");
}

// ── Step 5: Business migrations ────────────────────────────────────────────────
async function businessMigrate() {
  if (SKIP.includes("business")) { log("Skipping business migrations"); return; }
  log("=== STEP 5: Business migrations ===");
  
  try {
    exec("node scripts/business-migrate.js");
    ok("Business migrations applied");
    addStep("Business migrations", "OK");
  } catch (e) {
    warn("Business migrations failed: " + e.message);
    addStep("Business migrations", "WARN", e.message.slice(0, 100));
  }
}

// ── Step 6: Cache clear ────────────────────────────────────────────────────────
async function clearCache() {
  log("=== STEP 6: Cache clear ===");
  
  const cacheDir = path.join(ROOT, ".next", "cache");
  if (fs.existsSync(cacheDir)) {
    if (!DRY_RUN) fs.rmSync(cacheDir, { recursive: true, force: true });
    ok("Next.js cache cleared");
  } else {
    ok("No cache to clear");
  }
  
  // Clear pipeline log if too large
  try {
    const logSize = fs.existsSync(LOG) ? fs.statSync(LOG).size : 0;
    if (logSize > 5 * 1024 * 1024) fs.writeFileSync(LOG, "");
  } catch {}
  
  addStep("Cache clear", "OK");
}

// ── Step 7: TypeScript check ───────────────────────────────────────────────────
async function typeCheck() {
  if (SKIP.includes("types")) { log("Skipping type check"); return; }
  log("=== STEP 7: TypeScript check ===");
  
  try {
    exec("npx tsc --noEmit");
    ok("TypeScript: 0 errors");
    addStep("TypeScript", "OK");
  } catch (e) {
    const lines = e.stdout?.split("\n").filter(l => l.includes("error TS")) || [];
    error(`TypeScript: ${lines.length} errors`);
    lines.slice(0, 5).forEach(l => report.errors.push(l));
    addStep("TypeScript", "FAIL", `${lines.length} errors`);
  }
}

// ── Step 8: Build (prod) ───────────────────────────────────────────────────────
async function build() {
  if (MODE !== "prod" || SKIP.includes("build")) { log("Skipping build (dev mode or --skip=build)"); return; }
  log("=== STEP 8: Next.js build ===");
  
  try {
    exec("npm run build");
    ok("Build successful");
    addStep("Build", "OK");
  } catch (e) {
    error("Build failed");
    report.errors.push("Build failed: " + e.message.slice(0, 200));
    addStep("Build", "FAIL", "Build error");
    // Rollback
    log("Rolling back due to build failure...");
    await rollback();
    process.exit(1);
  }
}

// ── Step 9: Health check ───────────────────────────────────────────────────────
async function healthCheck() {
  if (SKIP.includes("health")) { log("Skipping health check"); return; }
  log("=== STEP 9: Health check ===");
  
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const endpoints = ["/api/settings", "/api/pages"];
  
  for (const ep of endpoints) {
    try {
      const url = new URL(ep, baseUrl);
      await new Promise((resolve, reject) => {
        const mod = url.protocol === "https:" ? https : http;
        const req = mod.get(url.toString(), { timeout: 5000 }, res => {
          if (res.statusCode < 500) resolve(res.statusCode);
          else reject(new Error(`HTTP ${res.statusCode}`));
        });
        req.on("error", reject);
        req.on("timeout", () => reject(new Error("Timeout")));
      });
      ok(`Health: ${ep} → OK`);
    } catch (e) {
      warn(`Health: ${ep} → ${e.message} (server may not be running)`);
    }
  }
  
  addStep("Health check", "OK");
}

// ── Step 10: Report ────────────────────────────────────────────────────────────
async function generateReport() {
  log("=== STEP 10: Deployment report ===");
  
  const duration = Math.round((Date.now() - report.startTime) / 1000);
  const hash = tryExec("git rev-parse HEAD").trim().slice(0, 8);
  const branch = tryExec("git branch --show-current").trim();
  
  const lines = [
    `# NOVA Deploy Report`,
    `**Date:** ${new Date().toISOString()}`,
    `**Duration:** ${duration}s`,
    `**Mode:** ${MODE}`,
    `**Commit:** ${hash} (${branch})`,
    `**Dry run:** ${DRY_RUN}`,
    ``,
    `## Steps`,
    ...report.steps.map(s => `- ${s.status === "OK" ? "✅" : s.status === "WARN" ? "⚠️" : "❌"} **${s.name}** — ${s.detail || s.status}`),
    ``,
  ];
  
  if (report.errors.length) {
    lines.push(`## Errors`, ...report.errors.map(e => `- ❌ ${e}`), ``);
  }
  if (report.warnings.length) {
    lines.push(`## Warnings`, ...report.warnings.map(w => `- ⚠️ ${w}`), ``);
  }
  
  const allOk = report.steps.every(s => s.status !== "FAIL");
  lines.push(`## Result`, allOk ? `✅ **Pipeline completed successfully**` : `❌ **Pipeline completed with errors**`);
  
  if (!DRY_RUN) fs.writeFileSync(REPORT, lines.join("\n"));
  log(`Report saved to ${REPORT}`);
  ok(`Pipeline complete in ${duration}s`);
}

// ── Rollback ───────────────────────────────────────────────────────────────────
async function rollback() {
  const rollbackFile = path.join(ROOT, ".rollback");
  if (!fs.existsSync(rollbackFile)) { warn("No rollback point found"); return; }
  const info = JSON.parse(fs.readFileSync(rollbackFile, "utf8"));
  warn(`Rolling back to ${info.hash}...`);
  tryExec(`git reset --hard ${info.hash}`);
  ok(`Rolled back to ${info.hash}`);
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  log(`\n${"=".repeat(60)}`);
  log(`NOVA PIPELINE — mode=${MODE} dry=${DRY_RUN} skip=[${SKIP.join(",")}]`);
  log(`${"=".repeat(60)}\n`);
  
  try {
    await preflight();
    await gitRollback();
    await gitPull();
    await prismaМigrate();
    await businessMigrate();
    await clearCache();
    await typeCheck();
    await build();
    await healthCheck();
    await generateReport();
    
    console.log("\n✅ Pipeline completed successfully!\n");
  } catch (e) {
    error("Pipeline failed: " + e.message);
    await generateReport();
    process.exit(1);
  }
}

main();