"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import { Car, Building2, BookOpen, Users, MessageSquare, TrendingUp, Eye, Star, Inbox, LayoutTemplate, Search } from "lucide-react";
import Link from "next/link";

interface Stats {
  cars: { total: number; active: number; sold: number };
  properties: { total: number; active: number };
  blog: { total: number; published: number };
  users: { total: number };
  messages: { total: number; unread: number };
  leads: { total: number; unread: number };
  recentLeads: Array<{ id: string; name: string; type: string; message: string; createdAt: string; isRead: boolean }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const quickActions = [
    { label: "Nouvelle voiture", href: "/admin/automobiles/nouveau", color: "bg-nova-red" },
    { label: "Nouveau bien", href: "/admin/immobilier/nouveau", color: "bg-nova-orange" },
    { label: "Nouvel article", href: "/admin/blog/nouveau", color: "bg-blue-500" },
    { label: "Paramètres site", href: "/admin/parametres", color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-xl font-bold">Tableau de bord</h1>
        <p className="text-white/40 text-sm mt-0.5">Bienvenue sur NOVA Admin — vue d'ensemble de votre plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Voitures"
          value={stats?.cars.total ?? "—"}
          sub={`${stats?.cars.active ?? 0} actives · ${stats?.cars.sold ?? 0} vendues`}
          icon={Car}
          color="red"
          trend={{ value: 12, label: "ce mois" }}
        />
        <StatCard
          title="Propriétés"
          value={stats?.properties.total ?? "—"}
          sub={`${stats?.properties.active ?? 0} disponibles`}
          icon={Building2}
          color="orange"
          trend={{ value: 8, label: "ce mois" }}
        />
        <StatCard
          title="Articles blog"
          value={stats?.blog.total ?? "—"}
          sub={`${stats?.blog.published ?? 0} publiés`}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Leads"
          value={stats?.leads.total ?? "—"}
          sub={`${stats?.leads.unread ?? 0} non traités`}
          icon={Inbox}
          color="green"
          trend={stats?.leads.unread ? { value: stats.leads.unread, label: "en attente" } : undefined}
        />
      </div>

      {/* Quick Actions + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Actions rapides</h2>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group">
                <span className={`w-2 h-2 rounded-full ${a.color}`} />
                <span className="text-white/70 group-hover:text-white text-sm transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-white/25 text-xs">🟢 Plateforme NOVA CMS — opérationnelle</p>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Derniers leads</h2>
            <Link href="/admin/leads" className="text-nova-red text-xs hover:underline">Voir tout →</Link>
          </div>
          {!stats?.recentLeads?.length ? (
            <div className="text-center py-8 text-white/25 text-sm">Aucun lead pour le moment</div>
          ) : (
            <div className="space-y-2">
              {stats.recentLeads.map(lead => (
                <div key={lead.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!lead.isRead ? "bg-nova-red" : "bg-white/20"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">{lead.name}</p>
                      <span className="text-white/30 text-xs">{lead.type}</span>
                    </div>
                    <p className="text-white/40 text-xs truncate">{lead.message.slice(0, 60)}</p>
                  </div>
                  <p className="text-white/25 text-xs flex-shrink-0">{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Accès rapide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Automobiles", href: "/admin/automobiles", icon: Car },
            { label: "Immobilier", href: "/admin/immobilier", icon: Building2 },
            { label: "Blog", href: "/admin/blog", icon: BookOpen },
            { label: "Page Builder", href: "/admin/pages", icon: LayoutTemplate },
            { label: "Leads", href: "/admin/leads", icon: Inbox },
            { label: "SEO", href: "/admin/seo", icon: Search },
            { label: "Paramètres", href: "/admin/parametres", icon: Star },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-nova-red/20 rounded-xl transition-all group text-center">
              <Icon size={18} className="text-white/40 group-hover:text-nova-red transition-colors" />
              <span className="text-white/60 group-hover:text-white text-xs transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
