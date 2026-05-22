import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LiveAgentButton } from "./live-agent-button";

interface ChatMessageProps {
  message: ChatMessageType;
  onConnectLiveAgent: () => void;
}

export function ChatMessage({ message, onConnectLiveAgent }: ChatMessageProps) {
  if (message.role === "system") {
    return (
      <div className="mx-auto max-w-[90%] rounded-full border border-border bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
        {message.content}
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-card-foreground"
        )}
      >
        <p>{message.content}</p>
        {message.showLiveAgent ? <LiveAgentButton onConnect={onConnectLiveAgent} /> : null}
      </div>
    </div>
  );
}
