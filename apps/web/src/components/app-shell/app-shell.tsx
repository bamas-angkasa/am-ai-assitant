"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bot, Building2, CheckCircle2, ChevronDown, ClipboardCheck, DatabaseZap, FileClock, Inbox, Menu, Settings, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncHealthBadge } from "@/components/status/badges";
import { cn } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";

const navItems = [
  { href: "/dashboard", label: "Maintenance Inbox", icon: Inbox },
  { href: "/manual-matching", label: "Manual Matching", icon: ClipboardCheck },
  { href: "/audit-log", label: "Audit Log", icon: FileClock },
  { href: "/sync-health", label: "Sync Health", icon: DatabaseZap },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { snapshot, notice, clearNotice } = useMaintenance();
  const unmatchedCount = snapshot.manual_match_messages.filter((item) => item.status === "needs_review").length;

  return (
    <div className="min-h-screen bg-app text-slate-900">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/80 bg-white/90 backdrop-blur-xl lg:flex lg:flex-col">
        <Brand />
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary navigation">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Operations</p>
          {navItems.map((item) => <NavItem key={item.href} item={item} active={pathname === item.href || (item.href === "/dashboard" && pathname.startsWith("/work-orders"))} count={item.href === "/manual-matching" ? unmatchedCount : undefined} />)}
        </nav>
        <div className="m-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900"><ShieldCheck className="h-4 w-4" />Human approval only</div>
          <p className="mt-2 text-xs leading-5 text-indigo-700">AI prepares drafts. Managers approve and send them manually.</p>
        </div>
        <div className="border-t border-slate-100 p-3"><UserMenu /></div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}><aside className="h-full w-[min(82vw,320px)] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" className="mr-3" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></Button></div><nav className="space-y-1 px-3 py-5">{navItems.map((item) => <div key={item.href} onClick={() => setMobileOpen(false)}><NavItem item={item} active={pathname === item.href} count={item.href === "/manual-matching" ? unmatchedCount : undefined} /></div>)}</nav></aside></div>}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></Button><div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><Building2 className="h-4 w-4" /><span>Vantage Residence</span><span className="text-slate-300">/</span><span className="font-medium text-slate-700">Maintenance Operations</span></div></div>
          <div className="flex items-center gap-3"><SyncHealthBadge status={snapshot.integration_health.appfolio_status} label="AppFolio healthy" /><div className="hidden h-8 w-px bg-slate-200 sm:block" /><div className="hidden items-center gap-2 sm:flex"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white"><UserRound className="h-4 w-4" /></div><div><p className="text-xs font-semibold">Maya Chen</p><p className="text-[11px] text-slate-400">Property Manager</p></div></div></div>
        </header>
        <main id="main-content" className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1600px] p-4 sm:p-6 xl:p-8">{children}</main>
      </div>

      {notice && <button type="button" onClick={clearNotice} className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-xl" aria-live="polite"><CheckCircle2 className="h-5 w-5 flex-none text-emerald-600" /><span>{notice}</span><X className="h-4 w-4 text-slate-400" /></button>}
    </div>
  );
}

function Brand() {
  return <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-slate-100 px-5"><div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-violet"><Bot className="h-4 w-4" /><Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-amber-300" /></div><div><p className="text-sm font-bold tracking-tight text-slate-950">AppFolio AI</p><p className="text-[11px] text-slate-400">Maintenance Assistant</p></div></Link>;
}

function NavItem({ item, active, count }: { item: (typeof navItems)[number]; active: boolean; count?: number }) {
  const Icon = item.icon;
  return <Link href={item.href} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}><Icon className={cn("h-4 w-4", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} /><span className="flex-1">{item.label}</span>{count ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">{count}</span> : null}</Link>;
}

function UserMenu() {
  return <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><UserRound className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Maya Chen</p><p className="truncate text-xs text-slate-400">maya@vantage.example</p></div><ChevronDown className="h-4 w-4 text-slate-400" /></button>;
}
