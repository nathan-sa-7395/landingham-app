import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Everything is public except /admin and anything nested under it
// (the login page at /admin/login is explicitly kept public).
const isPublicRoute = createRouteMatcher(["/", "/admin/login"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
