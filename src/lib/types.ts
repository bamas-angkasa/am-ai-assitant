export type UserRole = "admin" | "building_owner" | "hoa_board" | "unit_owner" | "tenant";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
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
  property_type: "apartment" | "condo" | "hoa" | "mixed_use";
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  owner_id: string;
  assigned_manager: string;
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
  bedrooms: number;
  bathrooms: number;
  availability_status: "available_now" | "leased" | "notice_given" | "offline";
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  mailing_address: string;
  unit_id: string;
  lease_id: string;
  move_in_date: string;
  move_out_date: string | null;
  account_status: "current" | "past_due" | "notice_given";
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  mailing_address: string;
  owned_property_ids: string[];
  owned_unit_ids: string[];
  statement_summary: {
    period: string;
    gross_income: number;
    expenses: number;
    net_distribution: number;
  };
  payment_distribution_summary: string;
}

export interface BoardMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  building_id: string;
  association: string;
  permission_level: "operations" | "financial_limited" | "full_board";
  managed_common_areas: string[];
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
  renewal_status: "not_started" | "offered" | "accepted" | "month_to_month";
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
  late_fee: number;
  ledger_charges: string[];
}

export interface Issue {
  id: string;
  work_order_id: string;
  reported_by: string;
  unit_id: string | null;
  building_id: string;
  category: "plumbing" | "electrical" | "building_maintenance" | "safety" | "hvac" | "appliance" | "pest_control";
  scope: "private_unit" | "common_area" | "building";
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to: string | null;
  assigned_vendor_id: string | null;
  created_at: string;
  last_update: string;
  completed_at: string | null;
}

export interface Vendor {
  id: string;
  name: string;
  service_type: string;
  contact_name: string;
  email: string;
  phone: string;
  assigned_work_order_ids: string[];
  invoice_status: "none" | "draft" | "submitted" | "paid" | "overdue";
}

export interface Invoice {
  id: string;
  vendor_id: string;
  property_id: string;
  work_order_id: string;
  amount: number;
  status: "draft" | "submitted" | "approved" | "paid" | "overdue";
  due_date: string;
  paid_date: string | null;
}

export interface Attachment {
  id: string;
  file_name: string;
  file_type: "pdf" | "jpg" | "png" | "docx";
  related_entity_type: "owner" | "property" | "unit" | "work_order" | "occupancy" | "rental_application" | "bill" | "charge" | "violation";
  related_entity_id: string;
  uploaded_date: string;
  visibility: "admin" | "owner" | "tenant" | "board" | "shared";
}

export interface Communication {
  id: string;
  sender_id: string;
  receiver_id: string;
  channel: "email" | "sms" | "portal";
  subject: string;
  body: string;
  related_tenant_id?: string;
  related_unit_id?: string;
  related_issue_id?: string;
  created_at: string;
  status: "sent" | "delivered" | "read" | "open";
}

export interface LiveChatEscalation {
  id: string;
  user_id: string;
  issue_id?: string;
  reason: string;
  status: "queued" | "assigned" | "closed";
  assigned_agent: string | null;
  created_at: string;
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
  | "building_announcements"
  | "maintenance_summary"
  | "complaint_followup"
  | "emergency_issue"
  | "request_live_agent"
  | "user_profile"
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
  owners: Owner[];
  boardMembers: BoardMember[];
  leases: Lease[];
  payments: Payment[];
  issues: Issue[];
  vendors: Vendor[];
  invoices: Invoice[];
  attachments: Attachment[];
  communications: Communication[];
  announcements: Announcement[];
  liveChatEscalations: LiveChatEscalation[];
}

export interface AppFolioDataContext extends AllowedData {
  users: User[];
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
