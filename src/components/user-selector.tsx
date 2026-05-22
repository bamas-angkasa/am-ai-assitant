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
    <section className="flex min-h-0 flex-1 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex-none border-b border-slate-200 px-5 py-6">
        <h2 className="text-lg font-semibold text-slate-950">Personas</h2>
        <p className="mt-2 font-mono text-xs font-semibold tracking-wider text-slate-500">Switch Context</p>
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
                "group flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left transition hover:bg-white hover:shadow-sm",
                isSelected ? "border-l-4 border-primary bg-blue-100 text-primary shadow-sm" : "text-slate-600"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-none", isSelected ? "text-primary" : "text-slate-500")} />
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-wide">{user.name}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", isSelected ? "text-primary" : "text-slate-500")}>{user.displayRole}</span>
                </span>
                {isSelected ? <CheckCircle2 className="h-4 w-4 flex-none" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-none border-t border-slate-200 p-4">
        <button type="button" className="h-10 w-full rounded-md border border-slate-200 bg-white text-sm font-semibold tracking-wide text-primary shadow-sm">
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
