import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/session";
import { getConvexServerClient } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import { AdminDashboard } from "./AdminDashboard";

/**
 * Server component gate for the CRM. Resolves the HTTP-only session
 * cookie against Convex before rendering the (client) dashboard.
 */
export default async function AdminPage() {
  const token = await getSessionToken();
  if (!token) redirect("/admin/login");

  let email: string | null = null;
  try {
    const convex = getConvexServerClient();
    const session = await convex.query(api.auth.getSession, { token });
    if (session) email = session.email;
  } catch {
    /* fall through */
  }

  if (!email) redirect("/admin/login");

  return <AdminDashboard email={email} />;
}
