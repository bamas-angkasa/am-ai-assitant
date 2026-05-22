package audit

type Log struct {
	ID                string   `json:"id"`
	Timestamp         string   `json:"timestamp"`
	UserID            string   `json:"userId"`
	Role              string   `json:"role"`
	ConversationID    string   `json:"conversationId"`
	Action            string   `json:"action"`
	Question          string   `json:"question"`
	Answer            string   `json:"answer"`
	Allowed           bool     `json:"allowed"`
	PermissionReason  string   `json:"permissionReason"`
	DataScopes         []string `json:"dataScopes"`
	SourceRefs         []Source `json:"sourceRefs"`
	EscalationCreated bool     `json:"escalationCreated"`
	Status            string   `json:"status"`
}

type Source struct {
	Type string `json:"type"`
	ID   string `json:"id"`
}
