"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import type { ChatMessage as ChatMessageType, User } from "@/lib/types";
import { nowLabel } from "@/lib/utils";
import { ChatMessage } from "./chat-message";

interface ChatPanelProps {
  selectedUser: User;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSubmitQuestion: (question: string) => void;
  onClear: () => void;
  onConnectLiveAgent: () => void;
}

export function ChatPanel({ selectedUser, messages, isLoading, onSubmitQuestion, onClear, onConnectLiveAgent }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;
    setInput("");
    onSubmitQuestion(question);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const form = event.currentTarget.form;
      form?.requestSubmit();
    }
  }

  return (
    <section className="flex min-h-[680px] flex-col rounded-lg border border-border bg-card shadow-soft lg:min-h-[calc(100vh-9.5rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Dian AI Assistant</h2>
          <p className="text-xs text-muted-foreground">Viewing as {selectedUser.name} - {selectedUser.displayRole}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Clear chat"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="thin-scrollbar flex-1 space-y-4 overflow-y-auto bg-muted/35 px-4 py-5">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onConnectLiveAgent={onConnectLiveAgent} />
        ))}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </span>
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about rent, lease, issues, units, or building updates..."
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Message Dian AI Assistant"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
            title="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Enter to send - Shift+Enter for a new line - {nowLabel()}</p>
      </form>
    </section>
  );
}
