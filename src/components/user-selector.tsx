"use client";

import { CheckCircle2, UserRound } from "lucide-react";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserSelectorProps {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
}

export function UserSelector({ users, selectedUser, onSelectUser }: UserSelectorProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <UserRound className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">User Selector</h2>
      </div>
      <div className="space-y-2">
        {users.map((user) => {
          const isSelected = user.id === selectedUser.id;
          return (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelectUser(user)}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-left transition hover:border-primary/60 hover:bg-muted/70",
                isSelected ? "border-primary bg-primary/10" : "border-border bg-transparent"
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-medium">{user.name}</span>
                  <span className="block text-xs text-muted-foreground">{user.displayRole}</span>
                </span>
                {isSelected ? <CheckCircle2 className="h-4 w-4 flex-none text-primary" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
