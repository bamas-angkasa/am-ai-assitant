"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, ClipboardList, History, MessageSquareText } from "lucide-react";
import { getAdminOverview } from "@/lib/api";
import { Card } from "./ui/card";

export function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOverview().then(setOverview).catch((item) => setError(item instanceof Error ? item.message : "Failed to load dashboard"));
  }, []);

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  if (!overview) {
    return <div className="rounded-lg border border-border bg-white p-4 text-sm text-[#667085]">Loading admin dashboard...</div>;
  }

  const auditLogs = overview.auditLogs ?? [];
  const escalations = overview.escalations ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={<ClipboardList className="h-4 w-4" />} label="Open maintenance" value={overview.openMaintenanceIssues} />
        <Metric icon={<AlertTriangle className="h-4 w-4" />} label="Overdue payments" value={overview.overduePayments} />
        <Metric icon={<MessageSquareText className="h-4 w-4" />} label="Escalations" value={overview.escalatedConversations} />
        <Metric icon={<History className="h-4 w-4" />} label="AI audit logs" value={overview.recentAIResponses} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-[#111827]">Audit Logs</h2>
          <p className="text-sm text-[#667085]">Every assistant conversation turn is recorded here.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F8F5FF] text-xs uppercase tracking-wide text-[#667085]">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Allowed</th>
                <th className="px-5 py-3">Question</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-[#667085]" colSpan={5}>No chat audit logs yet. Ask a question in the assistant demo.</td>
                </tr>
              ) : (
                auditLogs.map((log: any) => (
                  <tr key={log.id} className="border-t border-border">
                    <td className="px-5 py-3 text-[#667085]">{log.timestamp}</td>
                    <td className="px-5 py-3">{log.userId}</td>
                    <td className="px-5 py-3">{log.status}</td>
                    <td className="px-5 py-3">{log.allowed ? "Yes" : "No"}</td>
                    <td className="px-5 py-3">{log.question}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-[#111827]">Escalations</h2>
        <div className="mt-3 space-y-3">
          {escalations.map((item: any) => (
            <div key={item.id} className="rounded-lg border border-border bg-white px-4 py-3 text-sm">
              <div className="font-medium text-[#111827]">{item.reason}</div>
              <div className="mt-1 text-[#667085]">{item.status} - {item.conversationId}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#667085]">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-semibold text-[#111827]">{value}</div>
    </Card>
  );
}
