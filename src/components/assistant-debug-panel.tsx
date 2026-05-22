import type { ReactNode } from "react";
import { Braces, CircleCheck, CircleX, Database, ListFilter, ShieldCheck, TerminalSquare } from "lucide-react";
import type { AssistantDebugState, User } from "@/lib/types";

interface AssistantDebugPanelProps {
  debugState: AssistantDebugState | null;
  selectedUser: User;
}

export function AssistantDebugPanel({ debugState, selectedUser }: AssistantDebugPanelProps) {
  const permission = debugState ? (debugState.permission.allowed ? "Validated" : "Denied") : "Validated";
  const entities = debugState
    ? [
        debugState.extractedEntities.issueId,
        debugState.extractedEntities.tenantName,
        debugState.extractedEntities.unitNumber ? `Unit ${debugState.extractedEntities.unitNumber}` : undefined,
        ...debugState.extractedEntities.keywords
      ]
        .filter(Boolean)
        .join(", ") || "null"
    : "null";

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-border/80 bg-white/[0.45] text-[#667085] backdrop-blur-xl">
      <div className="glass-panel flex-none border-b px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#111827]">Assistant Reasoning</h2>
            <p className="mt-2 font-mono text-xs text-primary">Internal Logic &amp; State</p>
          </div>
          <TerminalSquare className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Braces className="h-4 w-4 text-primary" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">current_context</h3>
          </div>
          <div className="rounded-[20px] border border-[#E6DFFF] bg-[#191827] p-4 font-mono text-xs leading-7 shadow-soft">
            <CodeLine label="user" value={debugState?.selectedUser ?? selectedUser.name} tone="cyan" comma />
            <CodeLine label="role" value={debugState?.role ?? selectedUser.displayRole} tone="yellow" comma />
            <CodeLine label="intent" value={debugState?.detectedIntent ?? "Initializing"} tone="pink" comma />
            <CodeLine label="entities" value={entities} muted comma={false} />
            <CodeLine label="permission" value={permission} tone={permission === "Denied" ? "red" : "green"} comma />
            <CodeLine label="escalation" value={debugState?.escalationNeeded ? "true" : "false"} tone="orange" />
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#111827]">Tracing Modules</h3>
          <TraceItem icon={<ListFilter className="h-4 w-4" />} label="Intent Analysis" active={Boolean(debugState)} />
          <TraceItem icon={<TerminalSquare className="h-4 w-4" />} label="Entity Extraction" active={Boolean(debugState?.extractedEntities.keywords.length)} />
          <TraceItem icon={<ShieldCheck className="h-4 w-4" />} label="Permissions" active />
          <TraceItem icon={<Database className="h-4 w-4" />} label="Data Sources" active={Boolean(debugState?.permission.dataUsed.length)} />
        </div>

        {debugState ? (
          <div className="mt-10 space-y-5 border-t border-border pt-7 text-sm">
            <ReasonLine
              allowed={debugState.permission.allowed}
              label="Permission"
              value={debugState.permission.allowed ? "Allowed" : "Denied"}
            />
            <p className="leading-6 text-[#667085]">{debugState.permission.reason}</p>
            <p className="break-words font-mono text-xs leading-6 text-[#98A2B3]">
              {debugState.permission.dataUsed.length ? debugState.permission.dataUsed.join(", ") : "No private records used"}
            </p>
          </div>
        ) : null}
      </div>

      <div className="glass-panel flex-none border-t px-6 py-4 text-center font-mono text-xs text-[#98A2B3]">v2.4.1-alpha.rc</div>
    </aside>
  );
}

function CodeLine({
  label,
  value,
  tone,
  muted = false,
  comma = false
}: {
  label: string;
  value: string;
  tone?: "cyan" | "yellow" | "pink" | "green" | "red" | "orange";
  muted?: boolean;
  comma?: boolean;
}) {
  const toneClass = {
    cyan: "text-[#A7F3D0]",
    yellow: "text-[#FDE68A]",
    pink: "text-[#FBCFE8]",
    green: "text-[#86EFAC]",
    red: "text-red-300",
    orange: "text-orange-300"
  }[tone ?? "cyan"];

  return (
    <p>
      <span className="text-[#98A2B3]">&quot;{label}&quot;: </span>
      <span className={muted ? "text-[#667085]" : toneClass}>{value === "true" || value === "false" || value === "null" ? value : `"${value}"`}</span>
      {comma ? <span className="text-[#98A2B3]">,</span> : null}
    </p>
  );
}

function TraceItem({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <div className={active ? "mb-2 flex items-center gap-4 rounded-2xl border border-[#C9B8FF] bg-[#F8F5FF] px-4 py-3 text-primary shadow-sm" : "mb-2 flex items-center gap-4 px-4 py-3 text-[#98A2B3]"}>
      {icon}
      <span className="font-mono text-base tracking-wide">{label}</span>
    </div>
  );
}

function ReasonLine({ allowed, label, value }: { allowed: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {allowed ? <CircleCheck className="h-4 w-4 text-[#4CAF73]" /> : <CircleX className="h-4 w-4 text-red-400" />}
      <span className="font-mono text-xs uppercase tracking-wider text-[#98A2B3]">{label}</span>
      <span className="font-medium text-[#111827]">{value}</span>
    </div>
  );
}
