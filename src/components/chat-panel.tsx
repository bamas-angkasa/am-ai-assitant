"use client";

import type { ReactNode } from "react";
import { FormEvent, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bot, Circle, Send, Trash2 } from "lucide-react";
import type { ChatMessage as ChatMessageType, User } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { Button } from "./ui/button";

interface ChatPanelProps {
  selectedUser: User;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSubmitQuestion: (question: string) => void;
  onClear: () => void;
  onConnectLiveAgent: () => void;
  suggestedQuestions?: ReactNode;
}

export function ChatPanel({ selectedUser, messages, isLoading, onSubmitQuestion, onClear, onConnectLiveAgent, suggestedQuestions }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const maxHeight = 168;
    textarea.style.height = "0px";

    if (!input.trim()) {
      textarea.style.height = "24px";
      textarea.style.overflowY = "hidden";
      return;
    }

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

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
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-16 flex-none items-center justify-between gap-3 border-b border-slate-200 px-8">
        <div>
          <h2 className="text-lg font-medium text-slate-950">Dian AI Assistant</h2>
          <p className="sr-only">Viewing as {selectedUser.name} - {selectedUser.displayRole}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-8 items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 text-xs font-semibold tracking-wider text-slate-800 shadow-sm">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
            LIVE AGENT
          </div>
          <Button
            onClick={onClear}
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-slate-950"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onConnectLiveAgent={onConnectLiveAgent} />
            ))}
            {isLoading ? (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                  </span>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {suggestedQuestions ? <div className="mt-8 pt-4">{suggestedQuestions}</div> : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-none border-t border-slate-200 bg-white px-8 py-3">
        <div className="mx-auto max-w-3xl">
          <div className="flex min-h-12 items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-md transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Dian AI..."
              className="min-h-6 flex-1 resize-none bg-transparent px-3 py-1 text-sm leading-6 outline-none placeholder:text-slate-400"
              aria-label="Message Dian AI Assistant"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-9 w-11 flex-none rounded-xl bg-primary text-white hover:bg-primary/95"
              aria-label="Send message"
              title="Send"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-center font-mono text-[11px] tracking-[0.16em] text-slate-400">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </form>
    </section>
  );
}
