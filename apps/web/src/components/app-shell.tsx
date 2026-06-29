"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Circle, Settings2, UserRound, X } from "lucide-react";
import { runAssistant } from "@/lib/assistant-engine";
import { clearSavedDataContext, getDefaultDataContext, loadSavedDataContext, parseDataContext, saveDataContext, serializeDataContext } from "@/lib/data-context";
import type { AppFolioDataContext, AssistantDebugState, ChatMessage, User } from "@/lib/types";
import { nowLabel } from "@/lib/utils";
import { AssistantDebugPanel } from "./assistant-debug-panel";
import { ChatPanel } from "./chat-panel";
import { DataContextPanel } from "./data-context-panel";
import { RoleCard } from "./role-card";
import { SuggestedQuestions } from "./suggested-questions";
import { UserSelector } from "./user-selector";
import { ThemeToggle } from "./theme-provider";

const initialAssistantMessage =
  "Hi, I'm Dian AI Assistant. I can help with rent, lease, maintenance issues, building updates, and property-related questions. Please select a user role and ask a question.";

export function AppShell() {
  const [dataContext, setDataContext] = useState<AppFolioDataContext>(() => getDefaultDataContext());
  const [selectedUser, setSelectedUser] = useState<User>(() => getDefaultDataContext().users[4]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createMessage("assistant", initialAssistantMessage)]);
  const [debugState, setDebugState] = useState<AssistantDebugState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState("Using built-in master data.");
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = loadSavedDataContext();
      if (!saved) return;

      setDataContext(saved);
      setSelectedUser(saved.users[4] ?? saved.users[0]);
      setDataStatus("Loaded imported master data from this browser.");
    } catch (error) {
      setDataStatus(error instanceof Error ? `Saved data could not be loaded: ${error.message}` : "Saved data could not be loaded.");
    }
  }, []);

  const permissionTone = useMemo(() => {
    if (!debugState) return "Validated";
    return debugState.permission.allowed ? "Allowed" : "Denied";
  }, [debugState]);

  function handleSelectUser(user: User) {
    setSelectedUser(user);
    setIsMobileSettingsOpen(false);
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

  function handleImportDataContext(rawJson: string) {
    try {
      const nextContext = parseDataContext(rawJson);
      saveDataContext(nextContext);
      setDataContext(nextContext);
      setSelectedUser(nextContext.users.find((user) => user.id === selectedUser.id) ?? nextContext.users[0]);
      setDebugState(null);
      setMessages([
        createMessage("assistant", initialAssistantMessage),
        createMessage("system", "Imported new master data. The assistant will answer from the uploaded records.")
      ]);
      setDataStatus(`Imported ${nextContext.users.length} users, ${nextContext.units.length} units, ${nextContext.issues.length} work orders.`);
    } catch (error) {
      setDataStatus(error instanceof Error ? `Import failed: ${error.message}` : "Import failed. Please check the JSON file.");
    }
  }

  function handleExportDataContext() {
    const blob = new Blob([serializeDataContext(dataContext)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dian-master-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setDataStatus("Exported current master data as JSON.");
  }

  function handleResetDataContext() {
    const defaultContext = getDefaultDataContext();
    clearSavedDataContext();
    setDataContext(defaultContext);
    setSelectedUser(defaultContext.users[4]);
    setDebugState(null);
    setMessages([createMessage("assistant", initialAssistantMessage), createMessage("system", "Reset to built-in demo master data.")]);
    setDataStatus("Using built-in master data.");
  }

  return (
    <main className="soft-app-bg h-screen overflow-hidden text-[#111827]">
      <div className="flex h-screen flex-col">
        <header className="glass-panel flex h-16 flex-none items-center justify-between border-b px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shadow-violet">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-primary sm:text-lg">Dian AI Assistant</h1>
              <p className="truncate text-xs text-[#667085] lg:hidden">{selectedUser.name} - {selectedUser.displayRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden h-9 items-center gap-2 rounded-full border border-[#D7F0DF] bg-[#EAF8EF] px-4 text-sm font-semibold tracking-wide text-[#356C4B] shadow-sm sm:flex">
              <Circle className="h-2 w-2 fill-[#4CAF73] text-[#4CAF73]" />
              Permission: {permissionTone}
            </div>
            <ThemeToggle />
            <span className="hidden text-lg font-medium tracking-wide text-[#111827] md:inline">System Admin</span>
            <button
              type="button"
              onClick={() => setIsMobileSettingsOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-violet lg:hidden"
              aria-label="Open profile settings"
              title="Profile settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-violet lg:flex">
              <UserRound className="h-4 w-4" />
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_380px]">
          <aside className="hidden min-h-0 flex-col bg-white/[0.35] lg:flex">
            <UserSelector users={dataContext.users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
            <div className="flex-none border-r border-border/80 bg-white/[0.35]">
              <RoleCard user={selectedUser} />
              <DataContextPanel
                dataContext={dataContext}
                status={dataStatus}
                onImport={handleImportDataContext}
                onExport={handleExportDataContext}
                onReset={handleResetDataContext}
              />
            </div>
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

          <div className="hidden min-h-0 lg:block">
            <AssistantDebugPanel debugState={debugState} selectedUser={selectedUser} />
          </div>
        </div>

        {isMobileSettingsOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/40"
              aria-label="Close profile settings"
              onClick={() => setIsMobileSettingsOpen(false)}
            />
            <section className="soft-app-bg absolute inset-y-0 right-0 flex w-full max-w-sm flex-col shadow-2xl">
              <div className="glass-panel flex h-16 flex-none items-center justify-between border-b px-4">
                <div>
                  <h2 className="text-base font-semibold text-[#111827]">Profile Settings</h2>
                  <p className="text-xs text-[#667085]">Persona, access, master data</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSettingsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-[#667085]"
                  aria-label="Close profile settings"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
                <UserSelector users={dataContext.users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
                <RoleCard user={selectedUser} />
                <DataContextPanel
                  dataContext={dataContext}
                  status={dataStatus}
                  onImport={handleImportDataContext}
                  onExport={handleExportDataContext}
                  onReset={handleResetDataContext}
                />
                <div className="mx-4 mb-4 overflow-hidden rounded-[20px]">
                  <AssistantDebugPanel debugState={debugState} selectedUser={selectedUser} />
                </div>
              </div>
            </section>
          </div>
        ) : null}
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
