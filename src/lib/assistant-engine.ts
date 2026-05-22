import { defaultDataContext } from "./mock-data";
import { checkPermission, getAllowedData } from "./access-control";
import type { AllowedData, AppFolioDataContext, AssistantIntent, AssistantResponse, ExtractedEntities, PermissionResult, User } from "./types";
import { formatCurrency, formatStatus } from "./utils";

export function detectIntent(question: string): AssistantIntent {
  const text = question.toLowerCase();

  if (/(flood|flooding|emergency|urgent(?! attention)|fire|burst|gas leak|danger)/.test(text)) return "emergency_issue";
  if (/(live agent|human|person|representative|connect me|talk to someone)/.test(text)) return "request_live_agent";
  if (/(called|phone|answered|answer|nobody|no one|complain|complaint)/.test(text)) return "complaint_followup";
  if (/(my profile|profile|who am i|my name|my phone|my number|my address|contact info|contact information)/.test(text)) return "user_profile";
  if (/(announcement|announcements|notice|notices|building update|building updates)/.test(text)) return "building_announcements";
  if (/(owe|rent|payment|balance|paid|outstanding)/.test(text)) {
    return "check_payment_balance";
  }
  if (/\b(lease|contract|agreement|end|ends|ending|expire|expires|expired)\b/.test(text)) return "check_lease_info";
  if (/(issue|maintenance|repair|plumbing|electrical|elevator|urgent attention)/.test(text)) {
    if (/(all|open|unresolved|summary|building|safety|maintenance issues|my units|urgent attention)/.test(text) && !/iss-\d+/i.test(question)) return "maintenance_summary";
    return "check_issue_status";
  }
  if (/(unit|units|vacant|occupied|status)/.test(text)) return "check_unit_status";
  if (/(building|apartment|summary|occupancy|facilities)/.test(text)) return "building_summary";

  return "out_of_scope";
}

export function extractEntities(question: string, dataContext: AppFolioDataContext = defaultDataContext): ExtractedEntities {
  const issueId = question.match(/ISS-\d{4}/i)?.[0]?.toUpperCase();
  const unitNumber = question.match(/(?:unit\s*)?(\d{3,4}[A-Z]?)/i)?.[1];
  const unit = unitNumber ? dataContext.units.find((item) => item.unit_number.toLowerCase() === unitNumber.toLowerCase()) : undefined;
  const tenant = dataContext.tenants.find((item) => question.toLowerCase().includes(item.name.split(" ")[0].toLowerCase()));
  const keywords = ["rent", "lease", "elevator", "payment", "maintenance", "issue", "unit", "building", "safety", "vacant", "flooding"].filter((keyword) =>
    question.toLowerCase().includes(keyword)
  );

  return {
    issueId,
    unitNumber,
    unitId: unit?.id,
    tenantName: tenant?.name,
    tenantId: tenant?.id,
    keywords
  };
}

export function runAssistant(user: User, question: string, dataContext: AppFolioDataContext = defaultDataContext): AssistantResponse {
  const intent = detectIntent(question);
  const entities = extractEntities(question, dataContext);
  const allowedData = getAllowedData(user, dataContext);
  const permission = checkPermission(user, intent, entities, allowedData, dataContext);
  const answer = generateAnswer(user, question, intent, entities, allowedData, permission);
  const escalationNeeded = shouldEscalateToLiveAgent(question, intent, permission, answer);

  return {
    answer,
    escalationNeeded,
    debug: {
      selectedUser: user.name,
      role: user.displayRole,
      detectedIntent: intent,
      extractedEntities: entities,
      permission,
      escalationNeeded
    }
  };
}

export function generateAnswer(
  user: User,
  question: string,
  intent: AssistantIntent,
  entities: ExtractedEntities,
  allowedData: AllowedData,
  permissionResult: PermissionResult
) {
  if (!permissionResult.allowed) {
    if (intent === "out_of_scope") {
      return "I'm here to help with property-related questions such as rent, lease, maintenance, building updates, and support requests.";
    }

    if (intent === "check_payment_balance" || intent === "unauthorized_access") {
      if (user.role === "hoa_board") {
        return "I'm sorry, I can't share private tenant payment details. I can only help with building operations, common area issues, and maintenance-related information.";
      }
      return "I'm sorry, I can't share another tenant's rent or payment information.";
    }

    if (intent === "check_issue_status") {
      return "I'm sorry, I can't access that issue because it is not linked to your unit or account.";
    }

    return `I'm sorry, I can't provide that information. ${permissionResult.reason}`;
  }

  if (intent === "complaint_followup") {
    return "I'm sorry you couldn't reach the team by phone. I can help check your request here. Would you like me to connect you with a live agent?";
  }

  if (intent === "emergency_issue") {
    return "This sounds urgent. I recommend contacting emergency maintenance immediately. I can also connect you with a live agent now to help escalate this issue.";
  }

  if (intent === "request_live_agent") {
    return "Of course. I can connect you with a live agent.";
  }

  if (intent === "user_profile") {
    const linkedTenant = allowedData.tenants.find((tenant) => tenant.id === user.tenantId);
    const linkedOwner = allowedData.owners.find((owner) => owner.id === user.ownerId || owner.id === user.unitOwnerId);
    const linkedBoardMember = allowedData.boardMembers.find((member) => member.id === user.hoaId);
    const unitLabels = allowedData.units.map((unit) => `Unit ${unit.unit_number}`).join(", ") || "None";
    const accountStatus = linkedTenant?.account_status ? ` Account status: ${formatStatus(linkedTenant.account_status)}.` : "";
    const ownerSummary = linkedOwner ? ` Owner distribution: ${linkedOwner.payment_distribution_summary}` : "";
    const boardSummary = linkedBoardMember ? ` HOA association: ${linkedBoardMember.association}.` : "";

    return `Your profile is ${user.name}, ${user.displayRole}. Email: ${user.email}. Phone: ${user.phone}. Address: ${user.address}. Linked units: ${unitLabels}.${accountStatus}${ownerSummary}${boardSummary}`;
  }

  if (intent === "check_issue_status") {
    const issue = entities.issueId
      ? allowedData.issues.find((item) => item.id === entities.issueId)
      : allowedData.issues.find((item) => question.toLowerCase().includes("elevator") && item.title.toLowerCase().includes("elevator"));

    if (!issue) {
      const requested = entities.issueId ? `issue ${entities.issueId}` : "that issue";
      return `I couldn't find ${requested} in the available records. Would you like me to connect you with a live agent?`;
    }

    if (issue.title.toLowerCase().includes("elevator")) {
      return "The elevator issue is currently in progress. Inspection has been completed, and the replacement part has been ordered.";
    }

    return `Your issue ${issue.id}, "${issue.title}", is currently ${issue.status.replace("_", " ")}. ${issue.last_update}`;
  }

  if (intent === "check_payment_balance") {
    if (allowedData.payments.length === 0) {
      return "I couldn't find a payment record in the available data. Would you like me to connect you with a live agent?";
    }

    if (user.role === "unit_owner" || user.role === "building_owner" || user.role === "admin") {
      const lines = allowedData.payments.map((payment) => {
        const unit = allowedData.units.find((item) => item.id === payment.unit_id);
        const tenant = allowedData.tenants.find((item) => item.id === payment.tenant_id);
        const tenantLabel = tenant ? `${tenant.name}, ` : "";
        return `${tenantLabel}Unit ${unit?.unit_number ?? payment.unit_id}: ${formatCurrency(payment.outstanding_balance)} outstanding for ${payment.period}. Status: ${formatStatus(payment.status)}. Late fee: ${formatCurrency(payment.late_fee)}.`;
      });
      return `Here is the outstanding rent summary based on records you can access:\n${lines.join("\n")}`;
    }

    const payment = allowedData.payments[0];
    return `For ${payment.period}, your rent amount is ${formatCurrency(payment.amount_due)}. You have paid ${formatCurrency(payment.amount_paid)}, so your outstanding balance is ${formatCurrency(payment.outstanding_balance)}.`;
  }

  if (intent === "check_lease_info") {
    const lease = allowedData.leases[0];
    if (!lease) return "I couldn't find lease information in the records available to you. Would you like me to connect you with a live agent?";

    const unit = allowedData.units.find((item) => item.id === lease.unit_id);
    const unitLabel = unit ? ` for Unit ${unit.unit_number}` : "";
    return `Your current lease${unitLabel} ends on ${formatDate(lease.end_date)}.`;
  }

  if (intent === "check_unit_status") {
    if (allowedData.units.length === 0) return "I couldn't find unit records in your allowed access scope.";

    const building = allowedData.buildings[0];
    const requestedVacant = question.toLowerCase().includes("vacant");
    const scopedUnits = requestedVacant ? allowedData.units.filter((unit) => unit.status === "vacant") : allowedData.units;

    if (requestedVacant && scopedUnits.length === 0) {
      return "I couldn't find any vacant units in the records available to you.";
    }

    const lines = scopedUnits.map((unit) => {
      const tenant = allowedData.tenants.find((item) => item.id === unit.tenant_id);
      const occupant = tenant ? `occupied by ${tenant.name}` : "vacant";
      return `Unit ${unit.unit_number} is ${occupant} with monthly rent of ${formatCurrency(unit.monthly_rent)}.`;
    });

    if (user.role === "unit_owner") {
      return `You currently own ${allowedData.units.length} units in ${building?.name ?? "the building"}:\n${lines.join("\n")}`;
    }

    return lines.join("\n");
  }

  if (intent === "building_summary") {
    const building = allowedData.buildings[0];
    if (!building) return "I couldn't find a building summary in your allowed access scope.";

    const unresolvedIssues = allowedData.issues.filter((issue) => issue.status !== "resolved");
    const outstandingRent = allowedData.payments.reduce((total, payment) => total + payment.outstanding_balance, 0);
    return `${building.name} has ${building.total_units} total units, ${building.occupied_units} occupied units, ${building.vacant_units} vacant units, ${unresolvedIssues.length} open maintenance issues, and ${formatCurrency(outstandingRent)} outstanding rent based on available demo payments.`;
  }

  if (intent === "building_announcements") {
    if (allowedData.announcements.length === 0) {
      return "I couldn't find building announcements in the records available to you.";
    }

    const prefix = allowedData.announcements.length === 1 ? "There is one building announcement:" : `There are ${allowedData.announcements.length} building announcements:`;
    const lines = allowedData.announcements.map((announcement) => `${announcement.title}. ${announcement.message}`);
    return `${prefix} ${lines.join(" ")}`;
  }

  if (intent === "maintenance_summary") {
    const unresolvedIssues = allowedData.issues.filter((issue) => issue.status === "open" || issue.status === "in_progress");
    if (unresolvedIssues.length === 0) return "I couldn't find open maintenance issues in the records available to you.";

    const text = question.toLowerCase();
    let visibleIssues = unresolvedIssues;

    if (text.includes("elevator")) {
      visibleIssues = unresolvedIssues.filter((issue) => issue.title.toLowerCase().includes("elevator"));
    } else if (text.includes("urgent attention")) {
      visibleIssues = unresolvedIssues.filter((issue) => issue.priority === "high" || issue.priority === "urgent");
    } else if (text.includes("safety")) {
      visibleIssues = unresolvedIssues.filter((issue) => issue.category === "safety");
    }

    if (visibleIssues.length === 0) {
      return "I couldn't find matching maintenance issues in the records available to you.";
    }

    const intro =
      user.role === "unit_owner"
        ? `Yes, there are ${visibleIssues.length} maintenance issues linked to your units:`
        : user.role === "building_owner"
          ? `There are ${visibleIssues.length} open or in-progress maintenance issues in your building:`
          : user.role === "admin"
            ? `There are ${visibleIssues.length} unresolved maintenance issues:`
            : `Here are the unresolved maintenance issues I can access:`;
    const lines = visibleIssues.map((issue) => {
      const unit = issue.unit_id ? allowedData.units.find((item) => item.id === issue.unit_id) : undefined;
      const location = unit ? `in Unit ${unit.unit_number}` : "in the common area";
      if (user.role === "admin") return issue.id;
      return `${issue.id}, ${issue.title} ${location}, currently ${issue.status.replace("_", " ")}`;
    });

    return user.role === "admin" ? `${intro} ${formatIdList(lines)}.` : `${intro} ${formatList(lines)}.`;
  }

  return "I'm here to help with property-related questions such as rent, lease, maintenance, building updates, and support requests.";
}

export function shouldEscalateToLiveAgent(question: string, intent: AssistantIntent, permissionResult: PermissionResult, answer: string) {
  const text = question.toLowerCase();
  return (
    intent === "emergency_issue" ||
    intent === "complaint_followup" ||
    intent === "request_live_agent" ||
    /(dispute|legal|contract dispute)/.test(text) ||
    answer.includes("I couldn't find") ||
    (permissionResult.allowed && permissionResult.dataUsed.length === 0 && intent === "check_issue_status")
  );
}

export function getDataUsedSummary(debugData: AllowedData) {
  return [
    ...debugData.buildings.map((building) => building.name),
    ...debugData.units.map((unit) => `Unit ${unit.unit_number}`),
    ...debugData.issues.map((issue) => `Issue ${issue.id}`)
  ];
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join("; ")}; and ${items[items.length - 1]}`;
}

function formatIdList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
