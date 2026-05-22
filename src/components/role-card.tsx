import { ShieldCheck } from "lucide-react";
import type { User } from "@/lib/types";

interface RoleCardProps {
  user: User;
}

export function RoleCard({ user }: RoleCardProps) {
  return (
    <section className="glass-card mx-4 mb-4 rounded-[20px] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold tracking-wide text-[#111827]">Allowed Scope</h2>
      </div>
      <p className="text-sm leading-6 text-[#667085]">{shortenScope(user)}</p>
    </section>
  );
}

function shortenScope(user: User) {
  if (user.role === "tenant") return "Own unit, payment, lease, issues, and building notices.";
  if (user.role === "hoa_board") return "Common areas, building maintenance, safety issues, and notices.";
  if (user.role === "unit_owner") return "Owned units, linked tenants, leases, payments, and issues.";
  if (user.role === "building_owner") return "Owned building operations, units, payments, and maintenance.";
  return user.accessDescription;
}
