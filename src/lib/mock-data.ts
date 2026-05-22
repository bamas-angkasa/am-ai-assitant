import type {
  Announcement,
  AppFolioDataContext,
  Attachment,
  BoardMember,
  Building,
  Communication,
  Invoice,
  Issue,
  Lease,
  LiveChatEscalation,
  Owner,
  Payment,
  Tenant,
  Unit,
  User,
  Vendor
} from "./types";

export const buildings: Building[] = [
  {
    id: "bldg-001",
    name: "Dian Heights",
    address: "1200 Market Street, San Francisco, CA",
    property_type: "apartment",
    total_units: 6,
    occupied_units: 5,
    vacant_units: 1,
    owner_id: "owner-001",
    assigned_manager: "Dian Property Admin",
    hoa_board_ids: ["board-001"],
    facilities: ["Elevator", "Secure lobby", "Bike storage", "Rooftop lounge"]
  }
];

export const units: Unit[] = [
  {
    id: "unit-101",
    building_id: "bldg-001",
    unit_number: "101",
    owner_id: "owner-002",
    tenant_id: "tenant-001",
    status: "occupied",
    monthly_rent: 2400,
    lease_id: "lease-001",
    bedrooms: 1,
    bathrooms: 1,
    availability_status: "leased"
  },
  {
    id: "unit-102",
    building_id: "bldg-001",
    unit_number: "102",
    owner_id: "owner-003",
    tenant_id: "tenant-002",
    status: "occupied",
    monthly_rent: 2650,
    lease_id: "lease-002",
    bedrooms: 2,
    bathrooms: 1,
    availability_status: "leased"
  },
  {
    id: "unit-103",
    building_id: "bldg-001",
    unit_number: "103",
    owner_id: "owner-003",
    tenant_id: null,
    status: "vacant",
    monthly_rent: 2550,
    lease_id: null,
    bedrooms: 2,
    bathrooms: 1,
    availability_status: "available_now"
  },
  {
    id: "unit-204",
    building_id: "bldg-001",
    unit_number: "204",
    owner_id: "owner-001",
    tenant_id: "tenant-003",
    status: "occupied",
    monthly_rent: 3100,
    lease_id: "lease-003",
    bedrooms: 2,
    bathrooms: 2,
    availability_status: "notice_given"
  }
];

export const tenants: Tenant[] = [
  {
    id: "tenant-001",
    name: "John Miller",
    email: "john.miller@example.com",
    phone: "555-0101",
    mailing_address: "Unit 101, Dian Heights",
    unit_id: "unit-101",
    lease_id: "lease-001",
    move_in_date: "2025-06-01",
    move_out_date: null,
    account_status: "past_due"
  },
  {
    id: "tenant-002",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "555-0102",
    mailing_address: "Unit 102, Dian Heights",
    unit_id: "unit-102",
    lease_id: "lease-002",
    move_in_date: "2025-09-01",
    move_out_date: null,
    account_status: "current"
  },
  {
    id: "tenant-003",
    name: "Caleb Rivera",
    email: "caleb.rivera@example.com",
    phone: "555-0103",
    mailing_address: "Unit 204, Dian Heights",
    unit_id: "unit-204",
    lease_id: "lease-003",
    move_in_date: "2024-08-15",
    move_out_date: "2026-06-30",
    account_status: "notice_given"
  }
];

export const owners: Owner[] = [
  {
    id: "owner-001",
    name: "Paul Anderson",
    email: "paul.anderson@example.com",
    phone: "555-0201",
    mailing_address: "88 Mission Street, San Francisco, CA",
    owned_property_ids: ["bldg-001"],
    owned_unit_ids: ["unit-101", "unit-102", "unit-103", "unit-204"],
    statement_summary: {
      period: "May 2026",
      gross_income: 5050,
      expenses: 1280,
      net_distribution: 3770
    },
    payment_distribution_summary: "May owner distribution is scheduled after open maintenance invoices clear."
  },
  {
    id: "owner-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-0202",
    mailing_address: "44 Bryant Street, San Francisco, CA",
    owned_property_ids: [],
    owned_unit_ids: ["unit-101"],
    statement_summary: {
      period: "May 2026",
      gross_income: 2400,
      expenses: 410,
      net_distribution: 1990
    },
    payment_distribution_summary: "Unit 101 has a partial tenant balance outstanding."
  },
  {
    id: "owner-003",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-0202",
    mailing_address: "44 Bryant Street, San Francisco, CA",
    owned_property_ids: [],
    owned_unit_ids: ["unit-102", "unit-103"],
    statement_summary: {
      period: "May 2026",
      gross_income: 2650,
      expenses: 520,
      net_distribution: 2130
    },
    payment_distribution_summary: "Unit 102 is current and Unit 103 is ready to market."
  }
];

export const boardMembers: BoardMember[] = [
  {
    id: "board-001",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-0301",
    building_id: "bldg-001",
    association: "Dian Heights HOA",
    permission_level: "operations",
    managed_common_areas: ["Lobby", "Elevator", "Roof"]
  }
];

export const leases: Lease[] = [
  {
    id: "lease-001",
    tenant_id: "tenant-001",
    unit_id: "unit-101",
    start_date: "2025-06-01",
    end_date: "2026-05-31",
    monthly_rent: 2400,
    deposit: 2400,
    status: "active",
    renewal_status: "offered"
  },
  {
    id: "lease-002",
    tenant_id: "tenant-002",
    unit_id: "unit-102",
    start_date: "2025-09-01",
    end_date: "2026-08-31",
    monthly_rent: 2650,
    deposit: 2650,
    status: "active",
    renewal_status: "not_started"
  },
  {
    id: "lease-003",
    tenant_id: "tenant-003",
    unit_id: "unit-204",
    start_date: "2024-08-15",
    end_date: "2026-06-30",
    monthly_rent: 3100,
    deposit: 3100,
    status: "active",
    renewal_status: "not_started"
  }
];

export const payments: Payment[] = [
  {
    id: "payment-001",
    tenant_id: "tenant-001",
    unit_id: "unit-101",
    period: "May 2026",
    amount_due: 2400,
    amount_paid: 1200,
    outstanding_balance: 1200,
    due_date: "2026-05-01",
    status: "partially_paid",
    late_fee: 75,
    ledger_charges: ["Base rent", "Late fee"]
  },
  {
    id: "payment-002",
    tenant_id: "tenant-002",
    unit_id: "unit-102",
    period: "May 2026",
    amount_due: 2650,
    amount_paid: 2650,
    outstanding_balance: 0,
    due_date: "2026-05-01",
    status: "paid",
    late_fee: 0,
    ledger_charges: ["Base rent"]
  },
  {
    id: "payment-003",
    tenant_id: "tenant-003",
    unit_id: "unit-204",
    period: "May 2026",
    amount_due: 3100,
    amount_paid: 0,
    outstanding_balance: 3100,
    due_date: "2026-05-01",
    status: "overdue",
    late_fee: 95,
    ledger_charges: ["Base rent", "Late fee", "Notice posting fee"]
  }
];

export const issues: Issue[] = [
  {
    id: "ISS-1001",
    work_order_id: "WO-1001",
    reported_by: "tenant-001",
    unit_id: "unit-101",
    building_id: "bldg-001",
    category: "plumbing",
    scope: "private_unit",
    title: "Kitchen sink leak",
    description: "Tenant reported leaking pipe below the kitchen sink.",
    status: "in_progress",
    priority: "medium",
    assigned_to: "Maintenance Team",
    assigned_vendor_id: "vendor-001",
    created_at: "2026-05-12",
    last_update: "A plumber is scheduled for May 23 between 10 AM and 12 PM.",
    completed_at: null
  },
  {
    id: "ISS-1002",
    work_order_id: "WO-1002",
    reported_by: "tenant-002",
    unit_id: "unit-102",
    building_id: "bldg-001",
    category: "hvac",
    scope: "private_unit",
    title: "Bedroom AC not cooling",
    description: "AC output is weak in the bedroom.",
    status: "open",
    priority: "high",
    assigned_to: "Maintenance Team",
    assigned_vendor_id: null,
    created_at: "2026-05-18",
    last_update: "The maintenance team is reviewing available technician times.",
    completed_at: null
  },
  {
    id: "ISS-1003",
    work_order_id: "WO-1003",
    reported_by: "board-001",
    unit_id: null,
    building_id: "bldg-001",
    category: "building_maintenance",
    scope: "common_area",
    title: "Elevator replacement part",
    description: "Elevator inspection found a worn door sensor.",
    status: "in_progress",
    priority: "urgent",
    assigned_to: "Building Operations",
    assigned_vendor_id: "vendor-002",
    created_at: "2026-05-17",
    last_update: "Inspection has been completed and the replacement part has been ordered.",
    completed_at: null
  },
  {
    id: "ISS-1004",
    work_order_id: "WO-1004",
    reported_by: "tenant-003",
    unit_id: "unit-204",
    building_id: "bldg-001",
    category: "appliance",
    scope: "private_unit",
    title: "Dishwasher not draining",
    description: "Dishwasher cycle completes but standing water remains at the bottom.",
    status: "resolved",
    priority: "medium",
    assigned_to: "Maintenance Team",
    assigned_vendor_id: "vendor-003",
    created_at: "2026-05-04",
    last_update: "Drain pump replaced and appliance tested successfully.",
    completed_at: "2026-05-07"
  },
  {
    id: "ISS-2001",
    work_order_id: "WO-2001",
    reported_by: "board-001",
    unit_id: null,
    building_id: "bldg-001",
    category: "safety",
    scope: "common_area",
    title: "Garage exit sign light out",
    description: "Emergency exit sign near garage stairwell B is not illuminated.",
    status: "open",
    priority: "urgent",
    assigned_to: "Building Operations",
    assigned_vendor_id: "vendor-004",
    created_at: "2026-05-21",
    last_update: "Electrical vendor contacted and same-day visit requested.",
    completed_at: null
  }
];

export const vendors: Vendor[] = [
  {
    id: "vendor-001",
    name: "Bay Pipe Services",
    service_type: "Plumbing",
    contact_name: "Riley Chen",
    email: "dispatch@baypipe.example.com",
    phone: "555-0401",
    assigned_work_order_ids: ["WO-1001"],
    invoice_status: "submitted"
  },
  {
    id: "vendor-002",
    name: "Metro Elevator",
    service_type: "Elevator",
    contact_name: "Avery Smith",
    email: "service@metroelevator.example.com",
    phone: "555-0402",
    assigned_work_order_ids: ["WO-1003"],
    invoice_status: "draft"
  },
  {
    id: "vendor-003",
    name: "Golden Gate Appliance Repair",
    service_type: "Appliance Repair",
    contact_name: "Mei Chen",
    email: "repairs@goldengateappliance.example.com",
    phone: "555-0403",
    assigned_work_order_ids: ["WO-1004"],
    invoice_status: "paid"
  },
  {
    id: "vendor-004",
    name: "BrightPath Electrical",
    service_type: "Electrical and Safety",
    contact_name: "Jasmine Moore",
    email: "urgent@brightpath.example.com",
    phone: "555-0404",
    assigned_work_order_ids: ["WO-2001"],
    invoice_status: "submitted"
  }
];

export const invoices: Invoice[] = [
  {
    id: "INV-3001",
    vendor_id: "vendor-001",
    property_id: "bldg-001",
    work_order_id: "WO-1001",
    amount: 425,
    status: "submitted",
    due_date: "2026-06-10",
    paid_date: null
  },
  {
    id: "INV-3002",
    vendor_id: "vendor-003",
    property_id: "bldg-001",
    work_order_id: "WO-1004",
    amount: 310,
    status: "paid",
    due_date: "2026-05-20",
    paid_date: "2026-05-14"
  }
];

export const attachments: Attachment[] = [
  {
    id: "ATT-9001",
    file_name: "lease-unit-101-john-miller.pdf",
    file_type: "pdf",
    related_entity_type: "unit",
    related_entity_id: "unit-101",
    uploaded_date: "2025-06-01",
    visibility: "tenant"
  },
  {
    id: "ATT-9002",
    file_name: "wo-1001-sink-photo.jpg",
    file_type: "jpg",
    related_entity_type: "work_order",
    related_entity_id: "WO-1001",
    uploaded_date: "2026-05-12",
    visibility: "shared"
  },
  {
    id: "ATT-9003",
    file_name: "may-2026-owner-statement-paul-anderson.pdf",
    file_type: "pdf",
    related_entity_type: "owner",
    related_entity_id: "owner-001",
    uploaded_date: "2026-05-21",
    visibility: "owner"
  },
  {
    id: "ATT-9004",
    file_name: "elevator-inspection-report.pdf",
    file_type: "pdf",
    related_entity_type: "work_order",
    related_entity_id: "WO-1003",
    uploaded_date: "2026-05-17",
    visibility: "board"
  }
];

export const communications: Communication[] = [
  {
    id: "MSG-8001",
    sender_id: "tenant-001",
    receiver_id: "user-admin",
    channel: "portal",
    subject: "Sink is still leaking",
    body: "I uploaded a photo and need confirmation for the plumber visit.",
    related_tenant_id: "tenant-001",
    related_unit_id: "unit-101",
    related_issue_id: "ISS-1001",
    created_at: "2026-05-19T09:35:00-07:00",
    status: "read"
  },
  {
    id: "MSG-8002",
    sender_id: "user-admin",
    receiver_id: "tenant-003",
    channel: "email",
    subject: "Move-out and account notice",
    body: "Your move-out date is recorded as June 30, 2026. Please contact the office about the May balance.",
    related_tenant_id: "tenant-003",
    related_unit_id: "unit-204",
    created_at: "2026-05-21T14:10:00-07:00",
    status: "delivered"
  }
];

export const liveChatEscalations: LiveChatEscalation[] = [
  {
    id: "ESC-6001",
    user_id: "user-tenant-john",
    issue_id: "ISS-1001",
    reason: "Tenant requested human follow-up after missed phone call.",
    status: "queued",
    assigned_agent: null,
    created_at: "2026-05-21T16:20:00-07:00"
  }
];

export const announcements: Announcement[] = [
  {
    id: "ann-001",
    building_id: "bldg-001",
    title: "Elevator service notice",
    message: "Elevator repair work is pending parts delivery. Updates will be posted daily.",
    visibility: "building"
  },
  {
    id: "ann-002",
    building_id: "bldg-001",
    title: "Garage access notice",
    message: "Garage entry will use manual attendant access on May 27, 2026 from 9 AM to 2 PM.",
    visibility: "building"
  }
];

export const users: User[] = [
  {
    id: "user-admin",
    name: "Dian Property Admin",
    email: "admin@dian.example.com",
    phone: "555-0001",
    address: "Dian Property Office",
    role: "admin",
    displayRole: "Admin",
    accessDescription: "Full demo access to properties, units, tenants, leases, payments, maintenance, vendors, and announcements.",
    buildingIds: ["bldg-001"]
  },
  {
    id: "user-owner",
    name: "Paul Anderson",
    email: "paul.anderson@example.com",
    phone: "555-0201",
    address: "88 Mission Street, San Francisco, CA",
    role: "building_owner",
    displayRole: "Building Owner",
    accessDescription: "Can view building-level operations, units, tenants, payment summaries, maintenance issues, and announcements for Dian Heights.",
    ownerId: "owner-001",
    buildingIds: ["bldg-001"]
  },
  {
    id: "user-board",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-0301",
    address: "Dian Heights",
    role: "hoa_board",
    displayRole: "HOA / Board Member",
    accessDescription: "Can view common-area and building maintenance records, safety issues, and building announcements. Private tenant financial data is excluded.",
    hoaId: "board-001",
    buildingIds: ["bldg-001"]
  },
  {
    id: "user-unit-owner",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "555-0202",
    address: "44 Bryant Street, San Francisco, CA",
    role: "unit_owner",
    displayRole: "Unit Owner",
    accessDescription: "Can view owned units, linked tenants, leases, payments, issues, and announcements for Unit 102 and Unit 103.",
    unitOwnerId: "owner-003",
    unitIds: ["unit-102", "unit-103"]
  },
  {
    id: "user-tenant-john",
    name: "John Miller",
    email: "john.miller@example.com",
    phone: "555-0101",
    address: "Unit 101, Dian Heights",
    role: "tenant",
    displayRole: "Tenant",
    accessDescription: "Unit 101, lease-001, payment-001, issue ISS-1001, and building announcements.",
    tenantId: "tenant-001",
    unitIds: ["unit-101"],
    leaseIds: ["lease-001"],
    paymentIds: ["payment-001"],
    issueIds: ["ISS-1001"]
  },
  {
    id: "user-tenant-emma",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "555-0102",
    address: "Unit 102, Dian Heights",
    role: "tenant",
    displayRole: "Tenant",
    accessDescription: "Unit 102, lease-002, payment-002, issue ISS-1002, and building announcements.",
    tenantId: "tenant-002",
    unitIds: ["unit-102"],
    leaseIds: ["lease-002"],
    paymentIds: ["payment-002"],
    issueIds: ["ISS-1002"]
  },
  {
    id: "user-tenant-caleb",
    name: "Caleb Rivera",
    email: "caleb.rivera@example.com",
    phone: "555-0103",
    address: "Unit 204, Dian Heights",
    role: "tenant",
    displayRole: "Tenant",
    accessDescription: "Unit 204, lease-003, payment-003, issue ISS-1004, and building announcements.",
    tenantId: "tenant-003",
    unitIds: ["unit-204"],
    leaseIds: ["lease-003"],
    paymentIds: ["payment-003"],
    issueIds: ["ISS-1004"]
  }
];

export const defaultDataContext: AppFolioDataContext = {
  users,
  buildings,
  units,
  tenants,
  owners,
  boardMembers,
  leases,
  payments,
  issues,
  vendors,
  invoices,
  attachments,
  communications,
  announcements,
  liveChatEscalations
};
