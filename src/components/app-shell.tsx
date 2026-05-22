"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, Shield, Sun } from "lucide-react";
import { users } from "@/lib/mock-data";
import { runAssistant } from "@/lib/assistant-engine";
import type { AssistantDebugState, ChatMessage, User } from "@/lib/types";
import { cn, nowLabel } from "@/lib/utils";
import { AssistantDebugPanel } from "./assistant-debug-panel";
import { ChatPanel } from "./chat-panel";
import { RoleCard } from "./role-card";
import { SuggestedQuestions } from "./suggested-questions";
import { UserSelector } from "./user-selector";

const initialAssistantMessage =
  "Hi, I'm Dian AI Assistant. I can help with rent, lease, maintenance issues, building updates, and property-related questions. Please select a user role and ask a question.";

export function AppShell() {
  const [selectedUser, setSelectedUser] = useState<User>(users[4]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createMessage("assistant", initialAssistantMessage)]);
  const [debugState, setDebugState] = useState<AssistantDebugState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const permissionTone = useMemo(() => {
    if (!debugState) return "Ready";
    return debugState.permission.allowed ? "Allowed" : "Denied";
  }, [debugState]);

  function handleSelectUser(user: User) {
    setSelectedUser(user);
    setDebugState(null);
    setMessages([
      createMessage("assistant", initialAssistantMessage),
      createMessage("system", `You are now viewing as ${user.name} - ${user.displayRole}.`)
    ]);
  }

  function handleSubmitQuestion(question: string) {
    const userMessage = createMessage("user", question);
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    window.setTimeout(() => {
      const response = runAssistant(selectedUser, question);
      setDebugState(response.debug);
      setMessages((current) => [
        ...current,
        createMessage("assistant", response.answer, { showLiveAgent: response.escalationNeeded })
      ]);
      setIsLoading(false);
    }, 450);
  }

  function handleClear() {
    setDebugState(null);
    setMessages([createMessage("assistant", initialAssistantMessage)]);
  }

  function handleConnectLiveAgent() {
    setMessages((current) => [
      ...current,
      createMessage("assistant", "Your conversation has been escalated to the property management team. An agent will follow up shortly.")
    ]);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Permission-first property assistant demo
            </div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Dian AI Assistant</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              AI assistant for tenants, owners, HOA boards, and property managers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                permissionTone === "Denied"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : permissionTone === "Allowed"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    : "border-border bg-card text-muted-foreground"
              )}
            >
              Permission: {permissionTone}
            </div>
            <button
              type="button"
              onClick={() => setIsDark((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition hover:bg-muted"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <UserSelector users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
            <RoleCard user={selectedUser} />
            <SuggestedQuestions role={selectedUser.role} onAsk={handleSubmitQuestion} />
          </div>

          <ChatPanel
            selectedUser={selectedUser}
            messages={messages}
            isLoading={isLoading}
            onSubmitQuestion={handleSubmitQuestion}
            onClear={handleClear}
            onConnectLiveAgent={handleConnectLiveAgent}
          />

          <div className="lg:sticky lg:top-5 lg:self-start">
            <AssistantDebugPanel debugState={debugState} />
          </div>
        </div>
      </div>
    </main>
  );
}

function createMessage(role: ChatMessage["role"], content: string, options?: Pick<ChatMessage, "showLiveAgent">): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    createdAt: nowLabel(),
    showLiveAgent: options?.showLiveAgent
  };
}
