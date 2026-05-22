import { ShieldCheck } from "lucide-react";
import type { User } from "@/lib/types";

interface RoleCardProps {
  user: User;
}

export function RoleCard({ user }: RoleCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Access Scope</h2>
      </div>
      <div className="rounded-lg bg-muted p-3">
        <p className="text-sm font-medium">{user.displayRole}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{user.accessDescription}</p>
      </div>
    </section>
  );
}
