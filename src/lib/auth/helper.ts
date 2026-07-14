import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { HttpError } from "@/lib/errors";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return session;
};

export async function requireUser() {
  const session = await getSession();

  if (!session) throw new HttpError("Unauthorized", 401);

  return session;
};