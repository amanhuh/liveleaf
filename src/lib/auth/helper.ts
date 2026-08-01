import { auth } from "@/lib/auth/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HttpError } from "@/lib/errors";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function requireUser(options?: { redirectTo?: string }) {
  const session = await getSession();

  if (!session) {
    if (options?.redirectTo) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("better-auth.session_token");
        cookieStore.delete("__Secure-better-auth.session_token");
      } catch {
        // Ignore cookie deletion errors in non-mutable contexts
      }
      redirect(options.redirectTo);
    }
    throw new HttpError("Unauthorized", 401);
  }
  return session;
}