"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Search } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const BREADCRUMBS: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/automobiles": "Automobile",
  "/admin/immobilier": "Immobilier",
  "/admin/blog": "Blog",
  "/admin/menus": "Menus",
  "/admin/pages": "Pages",
  "/admin/medias": "Médias",
  "/admin/messages": "Messages",
  "/admin/utilisateurs": "Utilisateurs",
  "/admin/parametres": "Paramètres",
};

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const current = BREADCRUMBS[pathname] || segments[segments.length - 1] || "Admin";

  return (
    <header className="h-14 bg-[#0D1117] border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/30">NOVA</span>
        <ChevronRight size={14} className="text-white/20" />
        <span className="text-white font-medium">{current}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle variant="full" className="hidden sm:flex" />
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <Search size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-nova-red rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center text-white font-semibold text-xs">
            {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white text-xs font-medium leading-none">
              {session?.user?.name || "Admin"}
            </span>
            <span className="text-white/30 text-[10px] leading-none mt-0.5">
              {(session?.user as any)?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
