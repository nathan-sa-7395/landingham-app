import "server-only";
import { ConvexHttpClient } from "convex/browser";

/**
 * Server-side Convex client used by Next.js route handlers and server
 * components (e.g. the admin layout cookie check). Reuses a single
 * instance per process.
 */
let _client: ConvexHttpClient | null = null;

export function getConvexServerClient(): ConvexHttpClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL is not set — run `npx convex dev` first.",
    );
  }
  _client = new ConvexHttpClient(url);
  return _client;
}
