import { announcements, buildings, issues, leases, payments, tenants, units } from "./mock-data";
import type { AllowedData, AssistantIntent, ExtractedEntities, PermissionResult, User } from "./types";

export function getAllowedData(user: User): AllowedData {
  if (user.role === "admin") {
    return { buildings, units, tenants, leases, payments, issues, announcements };
  }

  if (user.role === "building_owner") {
    const buildingIds = user.buildingIds ?? [];
    const scopedUnits = units.filter((unit) => buildingIds.includes(unit.building_id));
    const scopedUnitIds = scopedUnits.map((unit) => unit.id);
    const scopedTenantIds = scopedUnits.map((unit) => unit.tenant_id).filter(Boolean) as string[];

    return {
      buildings: buildings.filter((building) => buildingIds.includes(building.id)),
      units: scopedUnits,
      tenants: tenants.filter((tenant) => scopedTenantIds.includes(tenant.id)),
      leases: leases.filter((lease) => scopedUnitIds.includes(lease.unit_id)),
      payments: payments.filter((payment) => scopedUnitIds.includes(payment.unit_id)),
      issues: issues.filter((issue) => buildingIds.includes(issue.building_id)),
      announcements: announcements.filter((announcement) => buildingIds.includes(announcement.building_id))
    };
  }

  if (user.role === "hoa_board") {
    const buildingIds = user.buildingIds ?? [];

    return {
      buildings: buildings.filter((building) => buildingIds.includes(building.id)),
      units: [],
      tenants: [],
      leases: [],
      payments: [],
      issues: issues.filter(
        (issue) =>
          buildingIds.includes(issue.building_id) &&
          (issue.scope === "common_area" || issue.category === "building_maintenance" || issue.category === "safety")
      ),
      announcements: announcements.filter((announcement) => buildingIds.includes(announcement.building_id))
    };
  }

  if (user.role === "unit_owner") {
    const unitIds = user.unitIds ?? [];
    const scopedUnits = units.filter((unit) => unitIds.includes(unit.id));
    const scopedTenantIds = scopedUnits.map((unit) => unit.tenant_id).filter(Boolean) as string[];

    return {
      buildings: buildings.filter((building) => scopedUnits.some((unit) => unit.building_id === building.id)),
      units: scopedUnits,
      tenants: tenants.filter((tenant) => scopedTenantIds.includes(tenant.id)),
      leases: leases.filter((lease) => unitIds.includes(lease.unit_id)),
      payments: payments.filter((payment) => unitIds.includes(payment.unit_id)),
      issues: issues.filter((issue) => issue.unit_id !== null && unitIds.includes(issue.unit_id)),
      announcements: announcements.filter((announcement) => scopedUnits.some((unit) => unit.building_id === announcement.building_id))
    };
  }

  const unitIds = user.unitIds ?? [];
  const leaseIds = user.leaseIds ?? [];
  const paymentIds = user.paymentIds ?? [];
  const issueIds = user.issueIds ?? [];
  const tenantId = user.tenantId;

  return {
    buildings: buildings.filter((building) => units.some((unit) => unitIds.includes(unit.id) && unit.building_id === building.id)),
    units: units.filter((unit) => unitIds.includes(unit.id)),
    tenants: tenants.filter((tenant) => tenant.id === tenantId),
    leases: leases.filter((lease) => leaseIds.includes(lease.id)),
    payments: payments.filter((payment) => paymentIds.includes(payment.id)),
    issues: issues.filter((issue) => issueIds.includes(issue.id)),
    announcements: announcements.filter((announcement) => units.some((unit) => unitIds.includes(unit.id) && unit.building_id === announcement.building_id))
  };
}

export function checkPermission(user: User, intent: AssistantIntent, entities: ExtractedEntities, allowedData: AllowedData): PermissionResult {
  if (intent === "out_of_scope") {
    return { allowed: false, reason: "This question is outside the supported property management demo scope.", dataUsed: [] };
  }

  if (intent === "complaint_followup" || intent === "emergency_issue" || intent === "request_live_agent") {
    return { allowed: true, reason: "No sensitive property records are needed for this response.", dataUsed: [] };
  }

  if (intent === "unauthorized_access") {
    return denyForRole(user);
  }

  if (entities.issueId) {
    const issueExists = issues.some((issue) => issue.id === entities.issueId);
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
