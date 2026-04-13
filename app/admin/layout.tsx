import type { ReactNode } from "react";

/**
 * Shared shell for everything under /admin.
 *
 * Auth gating is NOT done here — it lives in `app/admin/page.tsx` (and
 * any other protected pages). That avoids redirecting the login route,
 * which is nested under this same layout.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
}
