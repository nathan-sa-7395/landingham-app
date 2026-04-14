import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema for Landingham & Winningmore.
 * Auth is handled by Clerk — only leads data lives here.
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
});
