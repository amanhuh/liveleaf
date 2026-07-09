import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/d"];

const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.cookies;
  return (
    cookies.has("better-auth.session_token") ||
    cookies.has("__Secure-better-auth.session_token")
  );
}

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const hasSession = hasSessionCookie(request);

  if (isProtected && !hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/d", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
