"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { MaintenanceProvider } from "@/lib/state/maintenance-provider";

export function RootChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/demo")) return children;
  return <MaintenanceProvider><AppShell>{children}</AppShell></MaintenanceProvider>;
}
