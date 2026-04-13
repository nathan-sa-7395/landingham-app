import { NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import { setSessionToken } from "@/lib/session";

export async function POST(req: Request) {
  const { email, code } = (await req.json()) as {
    email?: string;
    code?: string;
  };
  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code required" },
      { status: 400 },
    );
  }

  try {
    const convex = getConvexServerClient();
    const { token } = await convex.mutation(api.auth.verifyOtp, {
      email,
      code,
    });
    await setSessionToken(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Invalid code" },
      { status: 401 },
    );
  }
}
