import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LiveAgentButton } from "./live-agent-button";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  onConnectLiveAgent: () => void;
}

export function ChatMessage({ message, onConnectLiveAgent }: ChatMessageProps) {
  if (message.role === "system") {
    return (
      <div className="mx-auto max-w-[90%] rounded-full border border-slate-200 bg-slate-100 px-6 py-3 text-center font-mono text-sm text-slate-600 shadow-sm">
        {message.content}
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <div className="mr-4 mt-7 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-white shadow-sm">
          <Bot className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[88%] whitespace-pre-line rounded-lg px-5 py-4 text-sm leading-7 shadow-sm sm:max-w-[72%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-slate-100 text-slate-950"
        )}
      >
        {!isUser ? <p className="mb-2 text-sm font-medium leading-none text-slate-700">Dian AI</p> : null}
        <p>{message.content}</p>
        {message.showLiveAgent ? <LiveAgentButton onConnect={onConnectLiveAgent} /> : null}
      </div>
    </div>
  );
}
