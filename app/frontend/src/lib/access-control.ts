import { defaultDataContext } from "./mock-data";
import type { AllowedData, AppFolioDataContext, AssistantIntent, ExtractedEntities, PermissionResult, User } from "./types";

export function getAllowedData(user: User, dataContext: AppFolioDataContext = defaultDataContext): AllowedData {
  const {
    announcements,
    attachments,
    boardMembers,
    buildings,
    communications,
    invoices,
    issues,
    leases,
    liveChatEscalations,
    owners,
    payments,
    propertyListings,
    tenants,
    units,
    vendors
  } = dataContext;

  if (user.role === "admin") {
    return {
      buildings,
      units,
      propertyListings,
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
  }

  if (user.role === "building_owner") {
    const buildingIds = user.buildingIds ?? [];
    const scopedUnits = units.filter((unit) => buildingIds.includes(unit.building_id));
    const scopedUnitIds = scopedUnits.map((unit) => unit.id);
    const scopedTenantIds = scopedUnits.map((unit) => unit.tenant_id).filter(Boolean) as string[];
    const scopedIssues = issues.filter((issue) => buildingIds.includes(issue.building_id));
    const scopedWorkOrderIds = scopedIssues.map((issue) => issue.work_order_id);

    return {
      buildings: buildings.filter((building) => buildingIds.includes(building.id)),
      units: scopedUnits,
      propertyListings: propertyListings.filter((listing) => buildingIds.includes(listing.building_id)),
      tenants: tenants.filter((tenant) => scopedTenantIds.includes(tenant.id)),
      owners: owners.filter((owner) => owner.id === user.ownerId || owner.owned_property_ids.some((id) => buildingIds.includes(id))),
      boardMembers: boardMembers.filter((member) => buildingIds.includes(member.building_id)),
      leases: leases.filter((lease) => scopedUnitIds.includes(lease.unit_id)),
      payments: payments.filter((payment) => scopedUnitIds.includes(payment.unit_id)),
      issues: scopedIssues,
      vendors: vendors.filter((vendor) => scopedIssues.some((issue) => issue.assigned_vendor_id === vendor.id)),
      invoices: invoices.filter((invoice) => buildingIds.includes(invoice.property_id)),
      attachments: attachments.filter(
        (attachment) =>
          attachment.visibility === "owner" ||
          attachment.visibility === "shared" ||
          scopedUnitIds.includes(attachment.related_entity_id) ||
          scopedWorkOrderIds.includes(attachment.related_entity_id)
      ),
      communications: communications.filter((message) => scopedTenantIds.includes(message.related_tenant_id ?? "") || scopedUnitIds.includes(message.related_unit_id ?? "")),
      announcements: announcements.filter((announcement) => buildingIds.includes(announcement.building_id)),
      liveChatEscalations: liveChatEscalations.filter((escalation) => scopedIssues.some((issue) => issue.id === escalation.issue_id))
    };
  }

  if (user.role === "hoa_board") {
    const buildingIds = user.buildingIds ?? [];
    const scopedIssues = issues.filter(
      (issue) =>
        buildingIds.includes(issue.building_id) &&
        (issue.scope === "common_area" || issue.category === "building_maintenance" || issue.category === "safety")
    );
    const scopedWorkOrderIds = scopedIssues.map((issue) => issue.work_order_id);

    return {
      buildings: buildings.filter((building) => buildingIds.includes(building.id)),
      units: [],
      propertyListings: propertyListings.filter((listing) => buildingIds.includes(listing.building_id)),
      tenants: [],
      owners: [],
      boardMembers: boardMembers.filter((member) => buildingIds.includes(member.building_id)),
      leases: [],
      payments: [],
      issues: scopedIssues,
      vendors: vendors.filter((vendor) => scopedIssues.some((issue) => issue.assigned_vendor_id === vendor.id)),
      invoices: [],
      attachments: attachments.filter(
        (attachment) => attachment.visibility === "board" || attachment.visibility === "shared" || scopedWorkOrderIds.includes(attachment.related_entity_id)
      ),
      communications: [],
      announcements: announcements.filter((announcement) => buildingIds.includes(announcement.building_id)),
      liveChatEscalations: []
    };
  }

  if (user.role === "unit_owner") {
    const unitIds = user.unitIds ?? [];
    const scopedUnits = units.filter((unit) => unitIds.includes(unit.id));
    const scopedTenantIds = scopedUnits.map((unit) => unit.tenant_id).filter(Boolean) as string[];
    const scopedIssues = issues.filter((issue) => issue.unit_id !== null && unitIds.includes(issue.unit_id));
    const scopedWorkOrderIds = scopedIssues.map((issue) => issue.work_order_id);

    return {
      buildings: buildings.filter((building) => scopedUnits.some((unit) => unit.building_id === building.id)),
      units: scopedUnits,
      propertyListings: propertyListings.filter((listing) => listing.unit_id !== null && unitIds.includes(listing.unit_id)),
      tenants: tenants.filter((tenant) => scopedTenantIds.includes(tenant.id)),
      owners: owners.filter((owner) => owner.id === user.unitOwnerId),
      boardMembers: [],
      leases: leases.filter((lease) => unitIds.includes(lease.unit_id)),
      payments: payments.filter((payment) => unitIds.includes(payment.unit_id)),
      issues: scopedIssues,
      vendors: vendors.filter((vendor) => scopedIssues.some((issue) => issue.assigned_vendor_id === vendor.id)),
      invoices: invoices.filter((invoice) => scopedWorkOrderIds.includes(invoice.work_order_id)),
      attachments: attachments.filter(
        (attachment) =>
          attachment.visibility === "owner" ||
          attachment.visibility === "shared" ||
          unitIds.includes(attachment.related_entity_id) ||
          scopedWorkOrderIds.includes(attachment.related_entity_id)
      ),
      communications: communications.filter((message) => unitIds.includes(message.related_unit_id ?? "")),
      announcements: announcements.filter((announcement) => scopedUnits.some((unit) => unit.building_id === announcement.building_id)),
      liveChatEscalations: liveChatEscalations.filter((escalation) => scopedIssues.some((issue) => issue.id === escalation.issue_id))
    };
  }

  const unitIds = user.unitIds ?? [];
  const leaseIds = user.leaseIds ?? [];
  const paymentIds = user.paymentIds ?? [];
  const issueIds = user.issueIds ?? [];
  const tenantId = user.tenantId;
  const scopedIssues = issues.filter((issue) => issueIds.includes(issue.id));
  const scopedWorkOrderIds = scopedIssues.map((issue) => issue.work_order_id);

  return {
    buildings: buildings.filter((building) => units.some((unit) => unitIds.includes(unit.id) && unit.building_id === building.id)),
    units: units.filter((unit) => unitIds.includes(unit.id)),
    propertyListings: propertyListings.filter((listing) => listing.unit_id !== null && unitIds.includes(listing.unit_id)),
    tenants: tenants.filter((tenant) => tenant.id === tenantId),
    owners: [],
    boardMembers: [],
    leases: leases.filter((lease) => leaseIds.includes(lease.id)),
    payments: payments.filter((payment) => paymentIds.includes(payment.id)),
    issues: scopedIssues,
    vendors: vendors.filter((vendor) => scopedIssues.some((issue) => issue.assigned_vendor_id === vendor.id)),
    invoices: [],
    attachments: attachments.filter(
      (attachment) =>
        attachment.visibility === "tenant" &&
        (unitIds.includes(attachment.related_entity_id) || scopedWorkOrderIds.includes(attachment.related_entity_id))
    ),
    communications: communications.filter((message) => message.related_tenant_id === tenantId || unitIds.includes(message.related_unit_id ?? "")),
    announcements: announcements.filter((announcement) => units.some((unit) => unitIds.includes(unit.id) && unit.building_id === announcement.building_id)),
    liveChatEscalations: liveChatEscalations.filter((escalation) => escalation.user_id === user.id)
  };
}

export function checkPermission(
  user: User,
  intent: AssistantIntent,
  entities: ExtractedEntities,
  allowedData: AllowedData,
  dataContext: AppFolioDataContext = defaultDataContext
): PermissionResult {
  if (intent === "out_of_scope") {
    return { allowed: false, reason: "This question is outside the supported property management demo scope.", dataUsed: [] };
  }

  if (intent === "complaint_followup" || intent === "emergency_issue" || intent === "request_live_agent") {
    return { allowed: true, reason: "No sensitive property records are needed for this response.", dataUsed: [] };
  }

  if (intent === "building_announcements") {
    return {
      allowed: allowedData.announcements.length > 0,
      reason:
        allowedData.announcements.length > 0
          ? "Announcements are filtered to buildings connected to the selected user."
          : "No announcements are available in the user's building scope.",
      dataUsed: allowedData.announcements.map((announcement) => `Announcement ${announcement.id}`)
    };
  }

  if (intent === "user_profile") {
    return {
      allowed: true,
      reason: "The selected user can view their own profile and linked account summary.",
      dataUsed: [`User ${user.id}`, ...allowedData.units.map((unit) => `Unit ${unit.unit_number}`)]
    };
  }

  if (intent === "unauthorized_access") {
    return denyForRole(user);
  }

  if (entities.issueId) {
    const issueExists = dataContext.issues.some((issue) => issue.id === entities.issueId);
    const allowedIssue = allowedData.issues.find((issue) => issue.id === entities.issueId);

    if (!issueExists) {
      return { allowed: true, reason: "Issue was not found in records available to this assistant.", dataUsed: [] };
    }

    if (!allowedIssue) {
      return { allowed: false, reason: issueDeniedReason(user), dataUsed: [] };
    }

    return { allowed: true, reason: "Requested issue is within the selected user's access scope.", dataUsed: [`Issue ${allowedIssue.id}`] };
  }

  if (intent === "check_payment_balance") {
    if (user.role === "hoa_board") {
      return { allowed: false, reason: "HOA board members cannot access private tenant payment details.", dataUsed: [] };
    }

    const requestedOtherTenant = entities.tenantId && entities.tenantId !== user.tenantId && user.role === "tenant";
    const requestedOtherUnit = entities.unitId && !allowedData.units.some((unit) => unit.id === entities.unitId);

    if (requestedOtherTenant || requestedOtherUnit) {
      return { allowed: false, reason: "Requested data belongs to another tenant.", dataUsed: [] };
    }

    if (allowedData.payments.length === 0) {
      return { allowed: true, reason: "No payment records are available in the user's allowed scope.", dataUsed: [] };
    }

    return {
      allowed: true,
      reason: "Payment records are inside the selected user's access scope.",
      dataUsed: allowedData.payments.map((payment) => `Payment ${payment.id}`)
    };
  }

  if (intent === "check_issue_status") {
    return {
      allowed: allowedData.issues.length > 0,
      reason: allowedData.issues.length > 0 ? "Issue records are inside the selected user's access scope." : "No issue records are available in the user's allowed scope.",
      dataUsed: allowedData.issues.map((issue) => `Issue ${issue.id}`)
    };
  }

  if (intent === "check_lease_info") {
    if (user.role === "hoa_board") {
      return { allowed: false, reason: "HOA board members cannot access private lease details.", dataUsed: [] };
    }

    if (entities.tenantId && entities.tenantId !== user.tenantId && user.role === "tenant") {
      return { allowed: false, reason: "Requested lease belongs to another tenant.", dataUsed: [] };
    }

    return {
      allowed: allowedData.leases.length > 0,
      reason: allowedData.leases.length > 0 ? "Lease records are inside the selected user's access scope." : "No lease records are available in the user's allowed scope.",
      dataUsed: allowedData.leases.map((lease) => `Lease ${lease.id}`)
    };
  }

  if (intent === "check_unit_status") {
    if (entities.unitId && !allowedData.units.some((unit) => unit.id === entities.unitId)) {
      return { allowed: false, reason: "Requested unit is outside the selected user's access scope.", dataUsed: [] };
    }

    return {
      allowed: allowedData.units.length > 0,
      reason: allowedData.units.length > 0 ? "Unit records are inside the selected user's access scope." : "No unit records are available in the user's allowed scope.",
      dataUsed: allowedData.units.map((unit) => `Unit ${unit.unit_number}`)
    };
  }

  if (intent === "building_summary" || intent === "maintenance_summary") {
    return {
      allowed: allowedData.buildings.length > 0 || allowedData.issues.length > 0,
      reason: "Building and maintenance records are filtered to the selected user's scope.",
      dataUsed: [
        ...allowedData.buildings.map((building) => building.name),
        ...allowedData.propertyListings.map((listing) => `Listing ${listing.id}`),
        ...allowedData.issues.map((issue) => `Issue ${issue.id}`)
      ]
    };
  }

  return { allowed: true, reason: "The request can be answered without private records.", dataUsed: [] };
}

function denyForRole(user: User): PermissionResult {
  if (user.role === "hoa_board") {
    return {
      allowed: false,
      reason: "HOA board access excludes private tenant payment and lease details.",
      dataUsed: []
    };
  }

  if (user.role === "tenant") {
    return {
      allowed: false,
      reason: "Tenants can only access their own unit, lease, payment, and issue records.",
      dataUsed: []
    };
  }

  return {
    allowed: false,
    reason: "The requested records are outside the selected user's authorized scope.",
    dataUsed: []
  };
}

function issueDeniedReason(user: User) {
  if (user.role === "tenant") {
    return "Requested issue is not linked to the tenant's unit or account.";
  }

  if (user.role === "hoa_board") {
    return "Requested issue is private to a tenant unit and outside HOA board access.";
  }

  return "Requested issue is outside the selected user's access scope.";
}
