const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface ChatApiResponse {
  conversationId: string;
  answer: string;
  auditId: string;
  escalationId?: string;
  escalationRequired: boolean;
  permission: {
    allowed: boolean;
    reason: string;
  };
  sources: Array<{
    type: string;
    id: string;
  }>;
}

export async function sendChatMessage(input: {
  userId: string;
  role: string;
  conversationId?: string;
  message: string;
}) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Chat request failed" }));
    throw new Error(error.error ?? "Chat request failed");
  }

  return (await response.json()) as ChatApiResponse;
}

export async function getAdminOverview() {
  const response = await fetch(`${API_URL}/admin/overview`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Admin overview request failed");
  }
  return response.json();
}

export async function getAllowedProperties(userId: string) {
  const response = await fetch(`${API_URL}/properties?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Properties request failed");
  }
  return response.json();
}
