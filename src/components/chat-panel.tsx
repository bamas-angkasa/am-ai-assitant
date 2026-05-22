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
    <section className="flex h-full min-h-0 flex-col bg-white/[0.45] backdrop-blur-xl">
      <div className="glass-panel flex h-14 flex-none items-center justify-between gap-3 border-b px-4 sm:h-16 sm:px-8">
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium text-[#111827] sm:text-lg">Dian AI Assistant</h2>
          <p className="sr-only">Viewing as {selectedUser.name} - {selectedUser.displayRole}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-8 items-center gap-2 rounded-full border border-[#D7F0DF] bg-[#EAF8EF] px-3 text-xs font-semibold tracking-wider text-[#356C4B] shadow-sm">
            <Circle className="h-2 w-2 fill-[#4CAF73] text-[#4CAF73]" />
            <span className="hidden min-[420px]:inline">LIVE AGENT</span>
            <span className="min-[420px]:hidden">LIVE</span>
          </div>
          <Button
            onClick={onClear}
            variant="ghost"
            size="icon"
            className="text-[#667085] hover:text-[#111827]"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onConnectLiveAgent={onConnectLiveAgent} />
            ))}
            {isLoading ? (
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-white shadow-violet sm:h-10 sm:w-10">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="rounded-[18px] border border-[#E6DFFF] bg-gradient-to-br from-[#F4F2FF] to-[#FFF5F8] px-4 py-3 text-sm text-[#667085] shadow-violet">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {suggestedQuestions ? <div className="mt-8 pt-4">{suggestedQuestions}</div> : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel flex-none border-t px-3 py-3 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex min-h-12 items-center gap-2 rounded-[20px] border border-border bg-white/[0.85] p-2 shadow-soft transition focus-within:border-[#C9B8FF] focus-within:ring-2 focus-within:ring-primary/15">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Dian AI..."
              className="min-h-6 flex-1 resize-none bg-transparent px-2 py-0 text-left text-sm leading-6 text-[#111827] outline-none placeholder:text-[#98A2B3] sm:px-3"
              aria-label="Message Dian AI Assistant"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-9 w-11 flex-none self-end rounded-2xl bg-primary text-white hover:bg-[#6D5DF0]"
              aria-label="Send message"
              title="Send"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] tracking-[0.12em] text-[#98A2B3] sm:text-[11px] sm:tracking-[0.16em]">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </form>
    </section>
  );
}
