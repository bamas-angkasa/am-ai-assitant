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
      <div className="mx-auto max-w-[95%] rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-center font-mono text-xs text-slate-600 shadow-sm sm:max-w-[90%] sm:px-6 sm:py-3 sm:text-sm">
        {message.content}
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <div className="mr-3 mt-7 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-white shadow-sm sm:mr-4 sm:h-10 sm:w-10">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[86%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[72%] sm:px-5 sm:py-4 sm:leading-7",
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
