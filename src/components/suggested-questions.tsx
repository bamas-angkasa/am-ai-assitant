import { Sparkles } from "lucide-react";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const questionsByRole: Record<UserRole, string[]> = {
  tenant: [
    "Show my profile and contact information.",
    "How much rent do I owe?",
    "What is the status of issue ISS-1001?",
    "When does my lease end?",
    "I called many times but nobody answered.",
    "There is water flooding in my apartment."
  ],
  hoa_board: [
    "Show my profile and contact information.",
    "What is the status of the elevator issue?",
    "Show building maintenance issues.",
    "Is there any safety issue in the building?",
    "How much rent does John in Unit 101 owe?"
  ],
  unit_owner: [
    "Show my profile and contact information.",
    "Show me the status of my units.",
    "Are there any open maintenance issues in my units?",
    "Show rent summary for my units."
  ],
  building_owner: [
    "Show my profile and contact information.",
    "Give me a summary of my apartment building.",
    "Show all open maintenance issues.",
    "Which units are vacant?",
    "Show outstanding rent summary."
  ],
  admin: [
    "Show my profile and contact information.",
    "Show all unresolved maintenance issues.",
    "Show all tenant payment status.",
    "Show building summary.",
    "What issues need urgent attention?"
  ]
};

interface SuggestedQuestionsProps {
  role: UserRole;
  onAsk: (question: string) => void;
  compact?: boolean;
}

export function SuggestedQuestions({ role, onAsk, compact = false }: SuggestedQuestionsProps) {
  const questions = questionsByRole[role].slice(0, compact ? 4 : undefined);

  if (compact) {
    return (
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-700">Suggested Questions</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onAsk(question)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 shadow-sm transition hover:border-primary/50 hover:text-primary"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Sparkles className="h-4 w-4 text-primary" />
        <CardTitle>Suggested Questions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-3">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onAsk(question)}
            className={cn("rounded-md border border-border bg-card px-3 py-2.5 text-left text-sm leading-5 transition hover:border-primary/50 hover:bg-secondary")}
          >
            {question}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
