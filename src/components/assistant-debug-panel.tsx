import { Activity, CircleCheck, CircleX } from "lucide-react";
import type { AssistantDebugState } from "@/lib/types";

interface AssistantDebugPanelProps {
  debugState: AssistantDebugState | null;
}

export function AssistantDebugPanel({ debugState }: AssistantDebugPanelProps) {
  return (
    <aside className="rounded-lg border border-border bg-card p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Assistant Reasoning</h2>
      </div>

      {!debugState ? (
        <div className="rounded-lg border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
          Ask a question to see intent detection, extracted entities, permission checks, allowed data, and escalation status.
        </div>
      ) : (
        <div className="space-y-4 text-sm">
          <DebugItem label="Selected User" value={debugState.selectedUser} />
          <DebugItem label="Role" value={debugState.role} />
          <DebugItem label="Detected Intent" value={debugState.detectedIntent} />
          <DebugItem
            label="Extracted Entities"
            value={
              [
                debugState.extractedEntities.issueId,
                debugState.extractedEntities.tenantName,
                debugState.extractedEntities.unitNumber ? `Unit ${debugState.extractedEntities.unitNumber}` : undefined,
                ...debugState.extractedEntities.keywords
              ]
                .filter(Boolean)
                .join(", ") || "None"
            }
          />
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Permission</p>
            <div className="flex items-center gap-2">
              {debugState.permission.allowed ? (
                <CircleCheck className="h-4 w-4 text-emerald-500" />
              ) : (
                <CircleX className="h-4 w-4 text-destructive" />
              )}
              <span className="font-medium">{debugState.permission.allowed ? "Allowed" : "Denied"}</span>
            </div>
          </div>
          <DebugItem label="Reason" value={debugState.permission.reason} />
          <DebugItem label="Data Used" value={debugState.permission.dataUsed.length ? debugState.permission.dataUsed.join(", ") : "No private records used"} />
          <DebugItem label="Escalation" value={debugState.escalationNeeded ? "Yes" : "No"} />
        </div>
      )}
    </aside>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words leading-5">{value}</p>
    </div>
  );
}
