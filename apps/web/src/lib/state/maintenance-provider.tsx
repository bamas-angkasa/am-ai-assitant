"use client";

import { createContext, type ReactNode, useCallback, useContext, useRef, useState } from "react";
import { MockMaintenanceApi } from "@/lib/api/mock-client";
import type { ApproveRecommendationPayload, MaintenanceSnapshot, ManualSendPayload, RejectRecommendationPayload } from "@/lib/types/maintenance";

interface MaintenanceContextValue {
  snapshot: MaintenanceSnapshot;
  pendingAction: string | null;
  notice: string | null;
  editDraft(id: string, draft: string): Promise<void>;
  approve(id: string, payload: ApproveRecommendationPayload): Promise<void>;
  reject(id: string, payload: RejectRecommendationPayload): Promise<void>;
  regenerate(id: string): Promise<void>;
  copy(id: string): Promise<void>;
  markManualSent(id: string, payload: ManualSendPayload): Promise<void>;
  matchMessage(messageId: string, workOrderId: string): Promise<void>;
  reset(): Promise<void>;
  clearNotice(): void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | null>(null);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef(new MockMaintenanceApi());
  const [snapshot, setSnapshot] = useState(() => apiRef.current.getSnapshot());
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = useCallback(async (key: string, message: string, action: () => Promise<unknown>) => {
    setPendingAction(key);
    setNotice(null);
    try {
      await action();
      setSnapshot(apiRef.current.getSnapshot());
      setNotice(message);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
      throw error;
    } finally {
      setPendingAction(null);
    }
  }, []);

  const value: MaintenanceContextValue = {
    snapshot,
    pendingAction,
    notice,
    editDraft: (id, draft) => run(`edit:${id}`, "Draft changes saved.", () => apiRef.current.editRecommendationDraft(id, draft)),
    approve: (id, payload) => run(`approve:${id}`, "Draft approved for manual delivery.", () => apiRef.current.approveRecommendation(id, payload)),
    reject: (id, payload) => run(`reject:${id}`, "Recommendation rejected.", () => apiRef.current.rejectRecommendation(id, payload)),
    regenerate: (id) => run(`regenerate:${id}`, "Recommendation regenerated and ready for review.", () => apiRef.current.refreshRecommendation(id)),
    copy: (id) => run(`copy:${id}`, "Approved draft copied and recorded.", async () => {
      const recommendation = await apiRef.current.getRecommendation(id);
      if (recommendation.approved_reply && navigator.clipboard) await navigator.clipboard.writeText(recommendation.approved_reply);
      return apiRef.current.copyApprovedDraft(id);
    }),
    markManualSent: (id, payload) => run(`manual:${id}`, "Manual delivery recorded.", () => apiRef.current.markManualSent(id, payload)),
    matchMessage: (messageId, workOrderId) => run(`match:${messageId}`, "Inbound message matched to the work order.", () => apiRef.current.matchInboundMessage(messageId, workOrderId)),
    reset: () => run("reset", "Demo data reset.", async () => { setSnapshot(await apiRef.current.reset()); }),
    clearNotice: () => setNotice(null)
  };

  return <MaintenanceContext.Provider value={value}>{children}</MaintenanceContext.Provider>;
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error("useMaintenance must be used inside MaintenanceProvider");
  return context;
}
