import { defaultDataContext } from "./mock-data";
import type { AppFolioDataContext } from "./types";

export const DATA_CONTEXT_STORAGE_KEY = "dian-ai-assistant-data-context";

const requiredCollections: Array<keyof AppFolioDataContext> = [
  "users",
  "buildings",
  "units",
  "propertyListings",
  "tenants",
  "owners",
  "boardMembers",
  "leases",
  "payments",
  "issues",
  "vendors",
  "invoices",
  "attachments",
  "communications",
  "announcements",
  "liveChatEscalations"
];

export function getDefaultDataContext(): AppFolioDataContext {
  return JSON.parse(JSON.stringify(defaultDataContext)) as AppFolioDataContext;
}

export function serializeDataContext(dataContext: AppFolioDataContext) {
  return JSON.stringify(dataContext, null, 2);
}

export function parseDataContext(rawJson: string): AppFolioDataContext {
  const parsed = JSON.parse(rawJson) as Partial<AppFolioDataContext>;
  parsed.propertyListings = parsed.propertyListings ?? [];
  const missing = requiredCollections.filter((collection) => !Array.isArray(parsed[collection]));

  if (missing.length > 0) {
    throw new Error(`Missing required collections: ${missing.join(", ")}`);
  }

  if (!parsed.users?.length) {
    throw new Error("The users collection must include at least one selectable user.");
  }

  return parsed as AppFolioDataContext;
}

export function saveDataContext(dataContext: AppFolioDataContext) {
  window.localStorage.setItem(DATA_CONTEXT_STORAGE_KEY, serializeDataContext(dataContext));
}

export function loadSavedDataContext(): AppFolioDataContext | null {
  const saved = window.localStorage.getItem(DATA_CONTEXT_STORAGE_KEY);
  if (!saved) return null;
  return parseDataContext(saved);
}

export function clearSavedDataContext() {
  window.localStorage.removeItem(DATA_CONTEXT_STORAGE_KEY);
}
