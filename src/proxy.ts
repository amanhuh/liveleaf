import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasSessionCookie(request: NextRequest): boolean {
  return (
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token")
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/d");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isAuthenticated = hasSessionCookie(request);

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/d", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/d", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/d/:path*", "/sign-in", "/sign-up"],
};