import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/lib/convexClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Last Minute Media Deals",
  description: "Media buying that moves at your speed.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
