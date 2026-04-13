import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new lead from the public quiz funnel.
 * Defaults status to "new" so it lands in the first Kanban column.
 */
export const createLead = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    interests: v.array(v.string()),
    cadence: v.string(),
    location: v.string(),
    budget: v.string(),
    bookingAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

/**
 * List every lead. The admin dashboard maps these into the generic
 * Kanban item shape — none of this domain knowledge leaks into the
 * Kanban component itself.
 */
export const listLeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

/**
 * Move a lead between Kanban columns. Called from the admin page's
 * `onDragEnd` handler — the Kanban component never sees this mutation.
 */
export const updateLeadStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});
