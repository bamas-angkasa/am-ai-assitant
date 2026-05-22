"use client";

import { Building2, CheckCircle2, Crown, House, Shield, UserRound, UsersRound } from "lucide-react";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserSelectorProps {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
}

export function UserSelector({ users, selectedUser, onSelectUser }: UserSelectorProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col border-r border-border/80 bg-white/[0.35]">
      <div className="flex-none border-b border-border/80 px-5 py-6">
        <h2 className="text-lg font-semibold text-[#111827]">Personas</h2>
        <p className="mt-2 font-mono text-xs font-semibold tracking-wider text-[#98A2B3]">Switch Context</p>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {users.map((user) => {
          const isSelected = user.id === selectedUser.id;
          const Icon = getRoleIcon(user.role);
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelectUser(user)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:border-[#C9B8FF] hover:bg-white/80 hover:shadow-sm",
                isSelected
                  ? "border-[#C9B8FF] bg-gradient-to-br from-white to-[#FAF7FF] text-primary shadow-violet"
                  : "border-transparent text-[#667085]"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-none", isSelected ? "text-primary" : "text-[#98A2B3]")} />
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-wide">{user.name}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", isSelected ? "text-primary" : "text-[#98A2B3]")}>{user.displayRole}</span>
                </span>
                {isSelected ? <CheckCircle2 className="h-4 w-4 flex-none" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-none border-t border-border/80 p-4">
        <button type="button" className="h-10 w-full rounded-2xl border border-[#C9B8FF] bg-white/80 text-sm font-semibold tracking-wide text-primary shadow-sm transition hover:bg-[#F8F5FF]">
          + Create New Persona
        </button>
      </div>
    </section>
  );
}

function getRoleIcon(role: User["role"]) {
  if (role === "admin") return Shield;
  if (role === "building_owner") return Building2;
  if (role === "hoa_board") return UsersRound;
  if (role === "unit_owner") return House;
  if (role === "tenant") return UserRound;
  return Crown;
}
