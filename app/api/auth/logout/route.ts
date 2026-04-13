import { NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import { clearSessionToken, getSessionToken } from "@/lib/session";

export async function POST() {
  const token = await getSessionToken();
  if (token) {
    try {
      const convex = getConvexServerClient();
      await convex.mutation(api.auth.logout, { token });
    } catch {
      /* ignore */
    }
  }
  await clearSessionToken();
  return NextResponse.json({ ok: true });
}
