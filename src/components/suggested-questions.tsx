import { Sparkles } from "lucide-react";
import type { UserRole } from "@/lib/types";

const questionsByRole: Record<UserRole, string[]> = {
  tenant: [
    "How much rent do I owe?",
    "What is the status of issue ISS-1001?",
    "When does my lease end?",
    "I called many times but nobody answered.",
    "There is water flooding in my apartment."
  ],
  hoa_board: [
    "What is the status of the elevator issue?",
    "Show building maintenance issues.",
    "Is there any safety issue in the building?",
    "How much rent does John in Unit 101 owe?"
  ],
  unit_owner: [
    "Show me the status of my units.",
    "Are there any open maintenance issues in my units?",
    "Show rent summary for my units."
  ],
  building_owner: [
    "Give me a summary of my apartment building.",
    "Show all open maintenance issues.",
    "Which units are vacant?",
    "Show outstanding rent summary."
  ],
  admin: [
    "Show all unresolved maintenance issues.",
    "Show all tenant payment status.",
    "Show building summary.",
    "What issues need urgent attention?"
  ]
};

interface SuggestedQuestionsProps {
  role: UserRole;
  onAsk: (question: string) => void;
}

export function SuggestedQuestions({ role, onAsk }: SuggestedQuestionsProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Suggested Questions</h2>
      </div>
      <div className="flex flex-col gap-2">
        {questionsByRole[role].map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onAsk(question)}
            className="rounded-lg border border-border px-3 py-2 text-left text-sm leading-5 transition hover:border-primary/60 hover:bg-muted"
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}
