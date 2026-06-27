import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import SessionProvider from "@/components/admin/SessionProvider";
import { canAccessAdmin } from "@/lib/permissions";

export const metadata = { title: "NOVA Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-admin-pathname") || "";

  // Login page — render without the admin shell (no session required)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");
  if (!canAccessAdmin((session.user as any).role)) redirect("/");

  return (
    <SessionProvider session={session}>
      <div className="admin-shell flex h-screen bg-[#080D14] text-white overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
