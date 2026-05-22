"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Circle, UserRound } from "lucide-react";
import { runAssistant } from "@/lib/assistant-engine";
import { getDefaultDataContext, loadSavedDataContext } from "@/lib/data-context";
import type { AppFolioDataContext, AssistantDebugState, ChatMessage, User } from "@/lib/types";
import { nowLabel } from "@/lib/utils";
import { AssistantDebugPanel } from "./assistant-debug-panel";
import { ChatPanel } from "./chat-panel";
import { RoleCard } from "./role-card";
import { SuggestedQuestions } from "./suggested-questions";
import { UserSelector } from "./user-selector";

const initialAssistantMessage =
  "Hi, I'm Dian AI Assistant. I can help with rent, lease, maintenance issues, building updates, and property-related questions. Please select a user role and ask a question.";

export function AppShell() {
  const [dataContext, setDataContext] = useState<AppFolioDataContext>(() => getDefaultDataContext());
  const [selectedUser, setSelectedUser] = useState<User>(() => getDefaultDataContext().users[4]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createMessage("assistant", initialAssistantMessage)]);
  const [debugState, setDebugState] = useState<AssistantDebugState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = loadSavedDataContext();
      if (!saved) return;

      setDataContext(saved);
      setSelectedUser(saved.users[4] ?? saved.users[0]);
    } catch (error) {
      console.warn(error instanceof Error ? `Saved context could not be loaded: ${error.message}` : "Saved context could not be loaded.");
    }
  }, []);

  const permissionTone = useMemo(() => {
    if (!debugState) return "Validated";
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
      const response = runAssistant(selectedUser, question, dataContext);
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
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <div className="flex h-screen flex-col">
        <header className="flex h-16 flex-none items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-semibold text-primary">Dian AI Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-semibold tracking-wide text-slate-700 sm:flex">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              Permission: {permissionTone}
            </div>
            <span className="text-lg font-medium tracking-wide text-slate-800">System Admin</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
              <UserRound className="h-4 w-4" />
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[300px_minmax(0,1fr)_380px]">
          <aside className="flex min-h-0 flex-col bg-slate-50">
            <UserSelector users={dataContext.users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
            <RoleCard user={selectedUser} />
          </aside>

          <ChatPanel
            selectedUser={selectedUser}
            messages={messages}
            isLoading={isLoading}
            onSubmitQuestion={handleSubmitQuestion}
            onClear={handleClear}
            onConnectLiveAgent={handleConnectLiveAgent}
            suggestedQuestions={<SuggestedQuestions role={selectedUser.role} onAsk={handleSubmitQuestion} compact />}
          />

          <AssistantDebugPanel debugState={debugState} selectedUser={selectedUser} />
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
