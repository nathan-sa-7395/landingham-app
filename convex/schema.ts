import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for Last Minute Media Deals.
 *
 * Four tables:
 *  - leads:         Quiz funnel submissions + CRM status.
 *  - allowed_users: Email allowlist for CRM access (populated manually).
 *  - otp_codes:     One-time passcodes issued during login.
 *  - sessions:      Active admin sessions, keyed by opaque token stored in an HTTP-only cookie.
 */
export default defineSchema({
  leads: defineTable({
    // Contact info
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    // Quiz answers
    interests: v.array(v.string()),
    cadence: v.string(),
    location: v.string(),
    budget: v.string(),
    // Booking
    bookingAt: v.number(), // unix ms
    // CRM
    status: v.string(), // kanban column id ("new" | "contacted" | ...)
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  allowed_users: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  otp_codes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    consumed: v.boolean(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    token: v.string(),
    email: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});
