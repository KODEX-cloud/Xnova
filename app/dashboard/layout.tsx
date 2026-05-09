"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, CreditCard, Plus, Home, Menu, X, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LINKS = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mes annonces", href: "/dashboard/annonces", icon: FileText },
  { label: "Mes paiements", href: "/dashboard/paiements", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm font-medium"
            onClick={() => setSideOpen(true)}
          >
            <Menu className="h-4 w-4" />
            Navigation
          </button>

          <div className="flex gap-8">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:flex flex-col w-60 flex-shrink-0">
              <SidebarContent pathname={pathname} />
            </aside>

            {/* Mobile sidebar */}
            <AnimatePresence>
              {sideOpen && (
                <motion.div
                  className="fixed inset-0 z-50 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="absolute inset-0 bg-black/70" onClick={() => setSideOpen(false)} />
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 p-6 pt-16 shadow-xl"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  >
                    <button
                      className="absolute top-4 right-4 text-white/50 hover:text-white"
                      onClick={() => setSideOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <SidebarContent pathname={pathname} onNav={() => setSideOpen(false)} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function SidebarContent({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 px-3">Mon espace</p>
      {LINKS.map((l) => {
        const Icon = l.icon;
        const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNav}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-gradient-to-r from-nova-red to-nova-orange text-white shadow-lg shadow-orange-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {l.label}
            {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
          </Link>
        );
      })}

      <div className="mt-4 pt-4 border-t border-white/10">
        <Link
          href="/publier"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-nova-red bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all"
        >
          <Plus className="h-4 w-4" />
          Publier une annonce
        </Link>
      </div>

      <div className="mt-3">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
