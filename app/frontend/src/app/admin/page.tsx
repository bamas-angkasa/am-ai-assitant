import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="soft-app-bg min-h-screen px-4 py-8 text-[#111827] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-[#667085]">Operational overview, escalations, conversations, and audit logs.</p>
        </div>
        <AdminDashboard />
      </div>
    </main>
  );
}
