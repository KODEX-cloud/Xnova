"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Heart, BarChart3, MessageSquare,
  CreditCard, Crown, Receipt, Bell, User, Settings, Plus,
  Home, Menu, X, ChevronRight, LogOut, Zap,
} from "lucide-react";

const NAV = [
  { label: "Tableau de bord",  href: "/dashboard",                icon: LayoutDashboard },
  { label: "Mes annonces",     href: "/dashboard/annonces",       icon: FileText },
  { label: "Mes favoris",      href: "/dashboard/favoris",        icon: Heart },
  { label: "Statistiques",     href: "/dashboard/statistiques",   icon: BarChart3 },
  { label: "Messages",         href: "/dashboard/messages",       icon: MessageSquare, badge: "messages" },
  { label: "Paiements",        href: "/dashboard/paiements",      icon: CreditCard },
  { label: "Abonnement",       href: "/dashboard/abonnement",     icon: Crown },
  { label: "Factures",         href: "/dashboard/factures",       icon: Receipt },
  { label: "Notifications",    href: "/dashboard/notifications",  icon: Bell, badge: "notifications" },
  { label: "Mon profil",       href: "/dashboard/profil",         icon: User },
  { label: "Paramètres",       href: "/dashboard/parametres",     icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sideOpen, setSideOpen] = useState(false);
  const [unread, setUnread] = useState({ messages: 0, notifications: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/messages?unread=true").then(r => r.json()).catch(() => ({ count: 0 })),
      fetch("/api/user/notifications?unread=true").then(r => r.json()).catch(() => ({ count: 0 })),
    ]).then(([m, n]) => setUnread({ messages: m?.count ?? 0, notifications: n?.count ?? 0 }));
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0F1623] flex-shrink-0 fixed top-0 left-0 h-screen z-30">
        <SidebarContent pathname={pathname} session={session} unread={unread} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sideOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setSideOpen(false)} />
            <motion.aside
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#0F1623] flex flex-col"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <button className="absolute top-4 right-4 text-white/40 hover:text-white" onClick={() => setSideOpen(false)}>
                <X size={18} />
              </button>
              <SidebarContent pathname={pathname} session={session} unread={unread} onNav={() => setSideOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden bg-[#0F1623] px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSideOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-nova-red rounded-md flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">NOVA</span>
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, session, unread, onNav }: {
  pathname: string;
  session: any;
  unread: { messages: number; notifications: number };
  onNav?: () => void;
}) {
  const user = session?.user as any;

  return (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 bg-nova-red rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm">NOVA</p>
          <p className="text-white/30 text-[10px]">Mon espace</p>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="flex items-center gap-3 px-3 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.image ? <img src={user.image} className="w-full h-full object-cover" alt="" /> : <User size={16} className="text-white/60" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.name || "Utilisateur"}</p>
            <p className="text-white/30 text-[10px] truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const count = badge ? unread[badge as keyof typeof unread] : 0;
          return (
            <Link key={href} href={href} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active ? "bg-nova-red text-white shadow-lg shadow-nova-red/20" : "text-white/50 hover:text-white hover:bg-white/[0.06]"
              }`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-nova-red text-white"}`}>
                  {count > 99 ? "99+" : count}
                </span>
              )}
              {active && <ChevronRight size={13} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-1">
        <Link href="/publier" onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-nova-red bg-nova-red/10 hover:bg-nova-red/15 border border-nova-red/20 transition-all">
          <Plus size={16} /> Publier une annonce
        </Link>
        <Link href="/" onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors">
          <Home size={16} /> Accueil
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 transition-colors w-full">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </div>
  );
}
