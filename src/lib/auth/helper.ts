import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HttpError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return session;
}

export async function requireUser(options?: { redirectTo?: string }) {
  const session = await getSession();

  if (!session) {
    if (options?.redirectTo) {
      // Clear the stale session cookie to prevent an immediate redirect loop.
      // The user will need to manually re-authenticate once, after which
      // the cookie will be reset and fresh.
      const response = NextResponse.redirect(options.redirectTo);
      response.cookies.set("better-auth.session_token", "", { path: "/", expires: new Date(0) });
      response.cookies.set("__Secure-better-auth.session_token", "", { path: "/", expires: new Date(0) });
      redirect(options.redirectTo);
    }
    throw new HttpError("Unauthorized", 401);
  }
  return session;
}