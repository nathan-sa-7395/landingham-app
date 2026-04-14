import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/lib/convexClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landingham & Winningmore",
  description: "Media buying that moves at your speed.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
