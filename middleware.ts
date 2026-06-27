import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      const res = NextResponse.next();
      res.headers.set("x-admin-pathname", pathname);
      return res;
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Block non-admin roles from the admin panel
    const adminRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AGENT_AUTO", "AGENT_IMMO"];
    if (!adminRoles.includes(token.role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const res = NextResponse.next();
    res.headers.set("x-admin-pathname", pathname);
    return res;
  }

  // ── Dashboard routes ──────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/publier")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/publier/:path*", "/publier"],
};
