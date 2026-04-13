import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** 6-digit numeric OTP as a zero-padded string. */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 32-byte random hex string for the session cookie. */
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Step 1 of login: the user enters their email. We verify it's in the
 * allowlist, generate a 6-digit code, store it, and "send" it by printing
 * to the Convex function log (mock email).
 */
export const requestOtp = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();

    const allowed = await ctx.db
      .query("allowed_users")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();

    if (!allowed) {
      // Intentionally generic — don't leak allowlist membership.
      throw new Error("Email not authorized");
    }

    // Invalidate any previous unconsumed codes for this email.
    const existing = await ctx.db
      .query("otp_codes")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .collect();
    for (const row of existing) {
      if (!row.consumed) await ctx.db.patch(row._id, { consumed: true });
    }

    const code = generateOtp();
    await ctx.db.insert("otp_codes", {
      email: normalized,
      code,
      expiresAt: Date.now() + OTP_TTL_MS,
      consumed: false,
    });

    // Mock email delivery.
    console.log(`[MOCK EMAIL] OTP for ${normalized}: ${code}`);

    return { ok: true };
  },
});

/**
 * Step 2 of login: verify the code the user typed in. On success, create
 * a session row and return the opaque token for the caller (the Next.js
 * route handler) to set as an HTTP-only cookie.
 */
export const verifyOtp = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, { email, code }) => {
    const normalized = email.trim().toLowerCase();

    const row = await ctx.db
      .query("otp_codes")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .order("desc")
      .first();

    if (!row) throw new Error("No OTP found");
    if (row.consumed) throw new Error("OTP already used");
    if (row.expiresAt < Date.now()) throw new Error("OTP expired");
    if (row.code !== code.trim()) throw new Error("Invalid OTP");

    await ctx.db.patch(row._id, { consumed: true });

    const token = generateSessionToken();
    await ctx.db.insert("sessions", {
      token,
      email: normalized,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });

    return { token, email: normalized };
  },
});

/**
 * Given a session token from the cookie, return the associated email
 * or null. Used by the admin layout to gate access.
 */
export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!session) return null;
    if (session.expiresAt < Date.now()) return null;
    return { email: session.email };
  },
});

/** Revoke a session (logout). */
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});
