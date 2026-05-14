import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Refresh the user session and propagate cookies
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Keep the main dashboard shell public for UI development.
  // Data-driven flows remain protected until auth is available.
  const protectedPrefixes = ["/diary", "/scan", "/onboarding"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from /login and /auth
  if (user && (pathname === "/login" || pathname === "/auth")) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Always return the supabaseResponse so that cookies are forwarded correctly.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
