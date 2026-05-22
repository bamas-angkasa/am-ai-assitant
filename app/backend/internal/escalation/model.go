package escalation

type Escalation struct {
	ID             string `json:"id"`
	UserID         string `json:"userId"`
	ConversationID string `json:"conversationId"`
	Reason         string `json:"reason"`
	Status         string `json:"status"`
	AssignedAgent  string `json:"assignedAgent,omitempty"`
	CreatedAt      string `json:"createdAt"`
}
