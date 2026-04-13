import { NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const convex = getConvexServerClient();
    await convex.mutation(api.auth.requestOtp, { email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to request OTP" },
      { status: 403 },
    );
  }
}
