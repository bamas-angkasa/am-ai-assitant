import { Headphones } from "lucide-react";
import { Button } from "./ui/button";

interface LiveAgentButtonProps {
  onConnect: () => void;
}

export function LiveAgentButton({ onConnect }: LiveAgentButtonProps) {
  return (
    <Button
      onClick={onConnect}
      size="sm"
      className="mt-3"
    >
      <Headphones className="h-4 w-4" />
      Connect to Live Agent
    </Button>
  );
}
