"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Database, Zap, Globe, RefreshCw, Play, RotateCcw,
  Shield, AlertTriangle, CheckCircle2, Clock, Server, Package,
  Terminal, Activity, ChevronDown, ChevronUp, Loader2, X,
  Settings, Cpu, HardDrive, Wifi, ExternalLink,
} from "lucide-react";

type Status = "ok" | "connected" | "built" | "success" | "error" | "unknown" | "no-build" | "failed";

interface PipelineStatus {
  timestamp:  string;
  git:        { status: Status; branch: string; hash: string | null; rollbackAt?: string };
  db:         { status: Status; counts?: { users: number; cars: number; properties: number }; pendingMigrations: number; error?: string };
  build:      { status: Status; builtAt?: string; cacheDir?: boolean };
  deploy:     { status: Status; lastReport: string | null };
  env:        { database: boolean; nextauth: boolean; resend: boolean; cinetpay: boolean; adminEmail: boolean; deployHook: boolean };
  migrations: { sql: any[]; business: any[] };
}

const STATUS_COLOR: Record<string, string> = {
  ok:          "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  connected:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  built:       "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  success:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  error:       "text-red-400 bg-red-400/10 border-red-400/30",
  failed:      "text-red-400 bg-red-400/10 border-red-400/30",
  "no-build":  "text-amber-400 bg-amber-400/10 border-amber-400/30",
  unknown:     "text-white/40 bg-white/5 border-white/10",
};

const STATUS_LABEL: Record<string, string> = {
  ok:          "OK",
  connected:   "Connecté",
  built:       "Compilé",
  success:     "Succès",
  error:       "Erreur",
  failed:      "Échec",
  "no-build":  "Non compilé",
  unknown:     "Inconnu",
};

function StatusBadge({ s }: { s: Status }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[s] || STATUS_COLOR.unknown}`}>
      {STATUS_LABEL[s] || s}
    </span>
  );
}

function EnvRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/60">{label}</span>
      {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}
    </div>
  );
}

export default function PipelineCenterPage() {
  const [data,      setData]      = useState<PipelineStatus | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [action,    setAction]    = useState<string | null>(null);
  const [actionRes, setActionRes] = useState<string | null>(null);
  const [showLog,   setShowLog]   = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pipeline");
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchStatus, 10_000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchStatus]);

  const runAction = async (act: string, label: string) => {
    setAction(label);
    setActionRes(null);
    try {
      const res = await fetch("/api/admin/deploy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: act }),
      });
      const json = await res.json();
      setActionRes(res.ok ? `✅ ${label} — OK` : `❌ Erreur: ${json.error || "inconnue"}`);
      fetchStatus();
    } catch (e: any) {
      setActionRes("❌ Erreur réseau: " + e.message);
    } finally {
      setAction(null);
    }
  };

  const runMigrations = async () => {
    setAction("Migrations");
    setActionRes(null);
    try {
      const res = await fetch("/api/admin/migrations", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "run-business" }),
      });
      const json = await res.json();
      setActionRes(res.ok ? "✅ Migrations appliquées" : `❌ ${json.error}`);
      fetchStatus();
    } catch (e: any) {
      setActionRes("❌ " + e.message);
    } finally {
      setAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Pipeline Center</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {data ? `Dernière actualisation : ${new Date(data.timestamp).toLocaleTimeString("fr-FR")}` : "Chargement…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(a => !a)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              autoRefresh ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/40 border border-white/10"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            {autoRefresh ? "Live ON" : "Live"}
          </button>
          <button
            onClick={() => { setLoading(true); fetchStatus(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: GitBranch, label: "Git", sub: data?.git.branch || "—", status: (data?.git.status || "unknown") as Status, detail: data?.git.hash?.slice(0, 8) },
          { icon: Database,  label: "Base",  sub: data?.db.pendingMigrations ? `${data.db.pendingMigrations} migrations en attente` : "À jour", status: (data?.db.status || "unknown") as Status, detail: data?.db.counts ? `${data.db.counts.users} users · ${data.db.counts.cars} cars · ${data.db.counts.properties} props` : undefined },
          { icon: HardDrive, label: "Build", sub: data?.build.builtAt ? new Date(data.build.builtAt).toLocaleDateString("fr-FR") : "—", status: (data?.build.status || "unknown") as Status, detail: data?.build.cacheDir ? "Cache actif" : "Sans cache" },
          { icon: Zap,       label: "Déploiement", sub: data?.deploy.lastReport ? new Date(data.deploy.lastReport).toLocaleDateString?.() || data.deploy.lastReport : "—", status: (data?.deploy.status || "unknown") as Status },
          { icon: Shield,    label: "Sécurité", sub: "Headers · Rate limit", status: "ok" as Status },
          { icon: Globe,     label: "SEO", sub: "Sitemap · Robots", status: "ok" as Status },
        ].map(({ icon: Icon, label, sub, status, detail }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white/60" />
                </div>
                <span className="text-white font-semibold text-sm">{label}</span>
              </div>
              <StatusBadge s={status} />
            </div>
            <p className="text-white/40 text-xs">{sub}</p>
            {detail && <p className="text-white/20 text-xs mt-1 truncate">{detail}</p>}
          </motion.div>
        ))}
      </div>

      {/* Action Result */}
      <AnimatePresence>
        {actionRes && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium ${
              actionRes.startsWith("✅") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <span>{actionRes}</span>
            <button onClick={() => setActionRes(null)}><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-nova-red" /> Actions Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Revalider Cache", act: () => runAction("revalidate", "Revalidation ISR"), icon: RefreshCw, color: "hover:border-blue-500/40 hover:text-blue-400" },
            { label: "Déclencher Deploy", act: () => runAction("deploy", "Déploiement"), icon: Play, color: "hover:border-emerald-500/40 hover:text-emerald-400" },
            { label: "Business Migrate", act: runMigrations, icon: Package, color: "hover:border-purple-500/40 hover:text-purple-400" },
            { label: "Audit SEO", act: () => runAction("revalidate", "Audit SEO"), icon: Globe, color: "hover:border-yellow-500/40 hover:text-yellow-400" },
            { label: "Rollback Git", act: () => runAction("rollback", "Rollback"), icon: RotateCcw, color: "hover:border-red-500/40 hover:text-red-400" },
          ].map(({ label, act, icon: Icon, color }) => (
            <button
              key={label}
              onClick={act}
              disabled={!!action}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium transition-all disabled:opacity-40 ${color}`}
            >
              {action === label ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Environment Variables */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-nova-red" /> Variables d'environnement
          </h2>
          <div>
            <EnvRow label="DATABASE_URL"       ok={data?.env.database  ?? false} />
            <EnvRow label="NEXTAUTH_SECRET"    ok={data?.env.nextauth  ?? false} />
            <EnvRow label="RESEND_API_KEY"     ok={data?.env.resend    ?? false} />
            <EnvRow label="CINETPAY"           ok={data?.env.cinetpay  ?? false} />
            <EnvRow label="ADMIN_EMAIL"        ok={data?.env.adminEmail ?? false} />
            <EnvRow label="HOSTINGER_WEBHOOK"  ok={data?.env.deployHook ?? false} />
          </div>
        </div>

        {/* Migration History */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-nova-red" /> Historique migrations
          </h2>
          {data?.migrations.business.length === 0 && (
            <p className="text-white/30 text-xs">Aucune migration appliquée</p>
          )}
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {data?.migrations.business.slice(0, 10).map((m: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                <span className="text-white/70 font-mono">{m.version || m.name}</span>
                <div className="flex items-center gap-2">
                  {m.appliedAt && <span className="text-white/30">{new Date(m.appliedAt).toLocaleDateString("fr-FR")}</span>}
                  <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${m.status === "APPLIED" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                    {m.status || "APPLIED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-white/30 text-xs">{data?.migrations.sql.length || 0} migrations SQL · {data?.migrations.business.length || 0} business migrations</p>
          </div>
        </div>
      </div>

      {/* DB stats */}
      {data?.db.counts && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-nova-red" /> Statistiques base de données
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Utilisateurs", value: data.db.counts.users },
              { label: "Voitures",     value: data.db.counts.cars },
              { label: "Propriétés",   value: data.db.counts.properties },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3">
                <p className="text-2xl font-black text-white">{value.toLocaleString("fr-FR")}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}