import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description, icon: Icon = Inbox }: { title: string; description: string; icon?: LucideIcon }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
      <div className="mb-4 rounded-2xl bg-white p-3 text-slate-400 shadow-sm"><Icon className="h-5 w-5" /></div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3" aria-label="Loading"><div className="h-7 w-44 animate-pulse rounded-lg bg-slate-100" />{Array.from({ length: rows }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white/80" />)}</div>;
}
