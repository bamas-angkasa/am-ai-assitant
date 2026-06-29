import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootChrome } from "@/components/app-shell/root-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppFolio Maintenance AI",
  description: "Human-approved maintenance operations powered by AppFolio context."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><RootChrome>{children}</RootChrome></body>
    </html>
  );
}
