import "server-only";
import { cookies } from "next/headers";

/**
 * Server-side helpers for the admin session cookie.
 * Name is scoped to the app to avoid clashing with other cookies.
 */
export const SESSION_COOKIE = "lmmd_session";

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
