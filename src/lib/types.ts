export type UserRole = "admin" | "building_owner" | "hoa_board" | "unit_owner" | "tenant";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  displayRole: string;
  accessDescription: string;
  tenantId?: string;
  ownerId?: string;
  unitOwnerId?: string;
  hoaId?: string;
  buildingIds?: string[];
  unitIds?: string[];
  leaseIds?: string[];
  paymentIds?: string[];
  issueIds?: string[];
}

export interface Building {
  id: string;
  name: string;
  address: string;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  owner_id: string;
  hoa_board_ids: string[];
  facilities: string[];
}

export interface Unit {
  id: string;
  building_id: string;
  unit_number: string;
  owner_id: string;
  tenant_id: string | null;
  status: "occupied" | "vacant";
  monthly_rent: number;
  lease_id: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit_id: string;
  lease_id: string;
}

export interface Lease {
  id: string;
  tenant_id: string;
  unit_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: "active" | "ended" | "pending";
}

export interface Payment {
  id: string;
  tenant_id: string;
  unit_id: string;
  period: string;
  amount_due: number;
  amount_paid: number;
  outstanding_balance: number;
  due_date: string;
  status: "paid" | "partially_paid" | "overdue" | "pending";
}

export interface Issue {
  id: string;
  reported_by: string;
  unit_id: string | null;
  building_id: string;
  category: "plumbing" | "electrical" | "building_maintenance" | "safety";
  scope: "private_unit" | "common_area" | "building";
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to: string | null;
  created_at: string;
  last_update: string;
}

export interface Announcement {
  id: string;
  building_id: string;
  title: string;
  message: string;
  visibility: "building" | "owners" | "tenants";
}

export type AssistantIntent =
  | "check_issue_status"
  | "check_payment_balance"
  | "check_lease_info"
  | "check_unit_status"
  | "building_summary"
  | "maintenance_summary"
  | "complaint_followup"
  | "emergency_issue"
  | "request_live_agent"
  | "unauthorized_access"
  | "out_of_scope";

export interface ExtractedEntities {
  issueId?: string;
  unitNumber?: string;
  unitId?: string;
  tenantName?: string;
  tenantId?: string;
  keywords: string[];
}

export interface AllowedData {
  buildings: Building[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  payments: Payment[];
  issues: Issue[];
  announcements: Announcement[];
}

export interface PermissionResult {
  allowed: boolean;
  reason: string;
  dataUsed: string[];
}

export interface AssistantDebugState {
  selectedUser: string;
  role: string;
  detectedIntent: AssistantIntent;
  extractedEntities: ExtractedEntities;
  permission: PermissionResult;
  escalationNeeded: boolean;
}

export interface AssistantResponse {
  answer: string;
  debug: AssistantDebugState;
  escalationNeeded: boolean;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  createdAt: string;
  showLiveAgent?: boolean;
}
