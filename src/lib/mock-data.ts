import type { Announcement, Building, Issue, Lease, Payment, Tenant, Unit, User } from "./types";

export const users: User[] = [
  {
    id: "admin_001",
    name: "Dian Property Admin",
    role: "admin",
    displayRole: "Admin",
    accessDescription: "All demo data across users, units, payments, leases, issues, and announcements."
  },
  {
    id: "owner_001",
    name: "Paul Anderson",
    role: "building_owner",
    displayRole: "Building Owner",
    accessDescription: "Full building access for Vantage Residence Apartment.",
    ownerId: "owner_001",
    buildingIds: ["building_001"]
  },
  {
    id: "hoa_001",
    name: "Michael Brown",
    role: "hoa_board",
    displayRole: "HOA / Board Member",
    accessDescription: "Common area issues, building maintenance, safety issues, and announcements.",
    hoaId: "hoa_001",
    buildingIds: ["building_001"]
  },
  {
    id: "unit_owner_001",
    name: "Sarah Johnson",
    role: "unit_owner",
    displayRole: "Unit Owner",
    accessDescription: "Owned units 101 and 102, tenants in those units, related issues, and rent summaries.",
    unitOwnerId: "unit_owner_001",
    unitIds: ["unit_101", "unit_102"]
  },
  {
    id: "user_tenant_001",
    name: "John Miller",
    role: "tenant",
    displayRole: "Tenant",
    accessDescription: "Unit 101, lease 001, payment 001, issue ISS-1001, and building announcements.",
    tenantId: "tenant_001",
    unitIds: ["unit_101"],
    leaseIds: ["lease_001"],
    paymentIds: ["payment_001"],
    issueIds: ["ISS-1001"]
  },
  {
    id: "user_tenant_002",
    name: "Emma Wilson",
    role: "tenant",
    displayRole: "Tenant",
    accessDescription: "Unit 102, lease 002, payment 002, issue ISS-1002, and building announcements.",
    tenantId: "tenant_002",
    unitIds: ["unit_102"],
    leaseIds: ["lease_002"],
    paymentIds: ["payment_002"],
    issueIds: ["ISS-1002"]
  }
];

export const buildings: Building[] = [
  {
    id: "building_001",
    name: "Vantage Residence Apartment",
    address: "120 Collins Street, Melbourne, VIC",
    total_units: 20,
    occupied_units: 18,
    vacant_units: 2,
    owner_id: "owner_001",
    hoa_board_ids: ["hoa_001"],
    facilities: ["Lobby", "Parking", "Elevator", "Gym", "Shared Laundry"]
  }
];

export const units: Unit[] = [
  {
    id: "unit_101",
    building_id: "building_001",
    unit_number: "101",
    owner_id: "unit_owner_001",
    tenant_id: "tenant_001",
    status: "occupied",
    monthly_rent: 1800,
    lease_id: "lease_001"
  },
  {
    id: "unit_102",
    building_id: "building_001",
    unit_number: "102",
    owner_id: "unit_owner_001",
    tenant_id: "tenant_002",
    status: "occupied",
    monthly_rent: 1750,
    lease_id: "lease_002"
  },
  {
    id: "unit_103",
    building_id: "building_001",
    unit_number: "103",
    owner_id: "owner_001",
    tenant_id: null,
    status: "vacant",
    monthly_rent: 1900,
    lease_id: null
  }
];

export const tenants: Tenant[] = [
  {
    id: "tenant_001",
    name: "John Miller",
    email: "john@example.com",
    phone: "+61 400 111 222",
    unit_id: "unit_101",
    lease_id: "lease_001"
  },
  {
    id: "tenant_002",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+61 400 333 444",
    unit_id: "unit_102",
    lease_id: "lease_002"
  }
];

export const leases: Lease[] = [
  {
    id: "lease_001",
    tenant_id: "tenant_001",
    unit_id: "unit_101",
    start_date: "2025-07-01",
    end_date: "2026-06-30",
    monthly_rent: 1800,
    deposit: 3600,
    status: "active"
  },
  {
    id: "lease_002",
    tenant_id: "tenant_002",
    unit_id: "unit_102",
    start_date: "2025-09-01",
    end_date: "2026-08-31",
    monthly_rent: 1750,
    deposit: 3500,
    status: "active"
  }
];

export const payments: Payment[] = [
  {
    id: "payment_001",
    tenant_id: "tenant_001",
    unit_id: "unit_101",
    period: "May 2026",
    amount_due: 1800,
    amount_paid: 1000,
    outstanding_balance: 800,
    due_date: "2026-05-01",
    status: "partially_paid"
  },
  {
    id: "payment_002",
    tenant_id: "tenant_002",
    unit_id: "unit_102",
    period: "May 2026",
    amount_due: 1750,
    amount_paid: 1750,
    outstanding_balance: 0,
    due_date: "2026-05-01",
    status: "paid"
  }
];

export const issues: Issue[] = [
  {
    id: "ISS-1001",
    reported_by: "tenant_001",
    unit_id: "unit_101",
    building_id: "building_001",
    category: "plumbing",
    scope: "private_unit",
    title: "Kitchen sink leaking",
    description: "Water is leaking under the kitchen sink.",
    status: "in_progress",
    priority: "medium",
    assigned_to: "Melbourne Plumbing Services",
    created_at: "2026-05-18",
    last_update: "Technician scheduled for May 24, 2026 between 10 AM - 12 PM."
  },
  {
    id: "ISS-1002",
    reported_by: "tenant_002",
    unit_id: "unit_102",
    building_id: "building_001",
    category: "electrical",
    scope: "private_unit",
    title: "Bedroom light not working",
    description: "Main bedroom ceiling light stopped working.",
    status: "open",
    priority: "low",
    assigned_to: null,
    created_at: "2026-05-19",
    last_update: "Waiting for maintenance team assignment."
  },
  {
    id: "ISS-2001",
    reported_by: "hoa_001",
    unit_id: null,
    building_id: "building_001",
    category: "building_maintenance",
    scope: "common_area",
    title: "Elevator making loud noise",
    description: "The main elevator is making noise between level 2 and 4.",
    status: "in_progress",
    priority: "high",
    assigned_to: "Elevator Maintenance Co.",
    created_at: "2026-05-17",
    last_update: "Inspection completed. Replacement part ordered."
  }
];

export const announcements: Announcement[] = [
  {
    id: "ANN-001",
    building_id: "building_001",
    title: "Scheduled Lobby Cleaning",
    message: "Lobby deep cleaning is scheduled for May 25, 2026 from 8 AM to 11 AM.",
    visibility: "building"
  }
];
