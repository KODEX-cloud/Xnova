"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Car, Building2, BookOpen, Navigation,
  Image, Users, Settings, LogOut, ChevronLeft,
  ChevronRight, MessageSquare, Zap, LayoutTemplate,
  Search, Inbox, Megaphone, Quote, Palette, Home,
  CreditCard, Crown, LayoutGrid, Sliders, Monitor, HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord", group: null },
  { href: "/admin/annonces", icon: LayoutGrid, label: "Toutes les annonces", group: "Annonces" },
  { href: "/admin/listings-editor", icon: Sliders, label: "Éditeur d'annonce", group: "Annonces" },
  { href: "/admin/automobiles", icon: Car, label: "Automobile", group: "Annonces" },
  { href: "/admin/immobilier", icon: Building2, label: "Immobilier", group: "Annonces" },
  { href: "/admin/homepage", icon: Home, label: "Page d'Accueil", group: "Contenu" },
  { href: "/admin/annonces-page", icon: LayoutGrid, label: "Page Annonces", group: "Contenu" },
  { href: "/admin/blog", icon: BookOpen, label: "Blog & Conseils", group: "Contenu" },
  { href: "/admin/pages", icon: LayoutTemplate, label: "Page Builder", group: "Contenu" },
  { href: "/admin/menus", icon: Navigation, label: "Menus", group: "Contenu" },
  { href: "/admin/faq", icon: HelpCircle, label: "FAQ", group: "Contenu" },
  { href: "/admin/medias", icon: Image, label: "Médias", group: "Contenu" },
  { href: "/admin/leads", icon: Inbox, label: "Leads & Contacts", group: "CRM" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages", group: "CRM" },
  { href: "/admin/promotions", icon: Megaphone, label: "Promotions", group: "Marketing" },
  { href: "/admin/temoignages", icon: Quote, label: "Témoignages", group: "Marketing" },
  { href: "/admin/seo", icon: Search, label: "SEO Manager", group: "Marketing" },
  { href: "/admin/paiements", icon: CreditCard, label: "Paiements", group: "Monétisation" },
  { href: "/admin/abonnements", icon: Crown, label: "Abonnements", group: "Monétisation" },
  { href: "/admin/apparence", icon: Monitor, label: "Apparence", group: "Admin" },
  { href: "/admin/ui-control", icon: Sliders, label: "UI Control", group: "Admin" },
  { href: "/admin/design", icon: Palette, label: "Design & Couleurs", group: "Admin" },
  { href: "/admin/utilisateurs", icon: Users, label: "Utilisateurs", group: "Admin" },
  { href: "/admin/parametres", icon: Settings, label: "Paramètres", group: "Admin" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-[#0D1117] border-r border-white/5 overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-nova-red rounded-lg">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="text-white font-bold text-base leading-none">NOVA</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest leading-none mt-0.5">Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto overflow-x-hidden">
        {(() => {
          const groups: string[] = [];
          NAV.forEach(item => {
            if (item.group && !groups.includes(item.group)) groups.push(item.group);
          });
          const ungrouped = NAV.filter(item => !item.group);
          return (
            <div className="space-y-0.5">
              {ungrouped.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link key={href} href={href}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative",
                      active ? "bg-nova-red/15 text-nova-red" : "text-white/50 hover:text-white hover:bg-white/5")}>
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-nova-red rounded-r-full" />}
                    <Icon size={18} className="flex-shrink-0" />
                    <AnimatePresence>{!collapsed && (
                      <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</motion.span>
                    )}</AnimatePresence>
                  </Link>
                );
              })}
              {groups.map(group => (
                <div key={group} className="pt-3">
                  <AnimatePresence>{!collapsed && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="px-3 pb-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-widest">{group}</motion.p>
                  )}</AnimatePresence>
                  {NAV.filter(item => item.group === group).map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <Link key={href} href={href}
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative",
                          active ? "bg-nova-red/15 text-nova-red" : "text-white/50 hover:text-white hover:bg-white/5")}>
                        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-nova-red rounded-r-full" />}
                        <Icon size={18} className="flex-shrink-0" />
                        <AnimatePresence>{!collapsed && (
                          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</motion.span>
                        )}</AnimatePresence>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-white/5 pt-2">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[72px] -right-3 z-10 w-6 h-6 rounded-full bg-[#1F2937] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
