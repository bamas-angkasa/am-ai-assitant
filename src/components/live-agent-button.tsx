import { Headphones } from "lucide-react";

interface LiveAgentButtonProps {
  onConnect: () => void;
}

export function LiveAgentButton({ onConnect }: LiveAgentButtonProps) {
  return (
    <button
      type="button"
      onClick={onConnect}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
    >
      <Headphones className="h-4 w-4" />
      Connect to Live Agent
    </button>
  );
}
