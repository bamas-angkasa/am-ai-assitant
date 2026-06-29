import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootChrome } from "@/components/app-shell/root-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const themeBootstrapScript = `
  try {
    var saved = localStorage.getItem('appfolio-ai-theme');
    var theme = saved === 'light' || saved === 'dark' ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (_) {}
`;

export const metadata: Metadata = {
  title: "AppFolio Maintenance AI",
  description: "Human-approved maintenance operations powered by AppFolio context."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} /></head>
      <body><ThemeProvider><RootChrome>{children}</RootChrome></ThemeProvider></body>
    </html>
  );
}
