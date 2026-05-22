package assistant

import (
	"ai-asset-management-assistant/backend/internal/audit"
	"ai-asset-management-assistant/backend/internal/conversations"
	"ai-asset-management-assistant/backend/internal/escalation"
	"ai-asset-management-assistant/backend/internal/permissions"
	"ai-asset-management-assistant/backend/internal/properties"
	"ai-asset-management-assistant/backend/internal/users"
	"fmt"
	"strings"
	"time"
)

type ChatRequest struct {
	UserID         string `json:"userId"`
	Role           string `json:"role"`
	ConversationID string `json:"conversationId"`
	Message        string `json:"message"`
}

type ChatResponse struct {
	ConversationID     string         `json:"conversationId"`
	Answer             string         `json:"answer"`
	Sources            []audit.Source `json:"sources"`
	AuditID            string         `json:"auditId"`
	EscalationID       string         `json:"escalationId,omitempty"`
	EscalationRequired bool           `json:"escalationRequired"`
	Permission         PermissionView `json:"permission"`
}

type PermissionView struct {
	Allowed bool   `json:"allowed"`
	Reason  string `json:"reason"`
}

type Service struct {
	users         *users.Repository
	properties    *properties.Repository
	conversations *conversations.Repository
	audit         *audit.Logger
	escalations   *escalation.Service
}

func NewService(
	usersRepo *users.Repository,
	propertiesRepo *properties.Repository,
	conversationsRepo *conversations.Repository,
	auditLogger *audit.Logger,
	escalationService *escalation.Service,
) *Service {
	return &Service{
		users:         usersRepo,
		properties:    propertiesRepo,
		conversations: conversationsRepo,
		audit:         auditLogger,
		escalations:   escalationService,
	}
}

func (s *Service) Chat(request ChatRequest) (ChatResponse, error) {
	user, ok := s.users.ByID(request.UserID)
	if !ok {
		return ChatResponse{}, fmt.Errorf("unknown user")
	}
	conversationID := request.ConversationID
	if conversationID == "" {
		conversationID = "conv_" + time.Now().Format("20060102150405")
	}

	now := time.Now().UTC().Format(time.RFC3339)
	s.conversations.AddMessage(conversationID, user.ID, string(user.Role), conversations.Message{
		ID:        "msg_user_" + time.Now().Format("150405000"),
		Role:      "user",
		Content:   request.Message,
		CreatedAt: now,
	})

	allData := s.properties.AllData()
	allowedData := permissions.Filter(user, allData)
	permission := permissions.Check(user, request.Message, allowedData)

	answer := ""
	status := "answered"
	escalationCreated := false
	escalationID := ""

	if !permission.Allowed {
		answer = "I cannot provide that information because it is outside your authorized property access. I can escalate this to the property management team if you need help."
		status = "permission_denied"
	} else {
		answer = buildMockAnswer(user, request.Message, allowedData)
		if shouldEscalate(request.Message, answer) {
			escalation := s.escalations.Create(user.ID, conversationID, "Assistant could not fully resolve the request or user requested a human follow-up.")
			escalationCreated = true
			escalationID = escalation.ID
			status = "escalated"
		}
	}

	s.conversations.AddMessage(conversationID, user.ID, string(user.Role), conversations.Message{
		ID:        "msg_ai_" + time.Now().Format("150405000"),
		Role:      "assistant",
		Content:   answer,
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
	})

	auditEntry := s.audit.Append(audit.Log{
		ID:                "audit_" + time.Now().Format("150405000"),
		Timestamp:         time.Now().UTC().Format(time.RFC3339),
		UserID:            user.ID,
		Role:              string(user.Role),
		ConversationID:    conversationID,
		Action:            "chat.answer",
		Question:          request.Message,
		Answer:            answer,
		Allowed:           permission.Allowed,
		PermissionReason:  permission.Reason,
		DataScopes:         permission.Scopes,
		SourceRefs:         permission.Sources,
		EscalationCreated: escalationCreated,
		Status:            status,
	})

	return ChatResponse{
		ConversationID:     conversationID,
		Answer:             answer,
		Sources:            permission.Sources,
		AuditID:            auditEntry.ID,
		EscalationID:       escalationID,
		EscalationRequired: escalationCreated || status == "permission_denied",
		Permission: PermissionView{
			Allowed: permission.Allowed,
			Reason:  permission.Reason,
		},
	}, nil
}

func buildMockAnswer(user users.User, question string, data properties.AllowedData) string {
	text := strings.ToLower(question)
	if properties.Contains(text, "rent", "owe", "due", "paid", "payment", "overdue") {
		if len(data.Payments) == 0 {
			return missingData()
		}
		if user.Role == users.RoleTenant {
			payment := data.Payments[0]
			maintenance := openMaintenance(data.MaintenanceRequests)
			extra := ""
			if len(maintenance) > 0 {
				extra = fmt.Sprintf(" There is also one open maintenance request for your %s, currently marked as %s.", maintenance[0].Title, strings.ReplaceAll(maintenance[0].Status, "_", " "))
			}
			return fmt.Sprintf("You currently owe %s for %s rent. Your due date is %s.%s", money(payment.OutstandingBalance), payment.Period, payment.DueDate, extra)
		}
		total := 0
		overdue := 0
		for _, payment := range data.Payments {
			total += payment.OutstandingBalance
			if payment.OutstandingBalance > 0 {
				overdue++
			}
		}
		return fmt.Sprintf("There are %d accounts with an outstanding balance in your allowed scope, totaling %s.", overdue, money(total))
	}

	if properties.Contains(text, "maintenance", "issue", "repair", "status", "open cases", "unresolved") {
		open := openMaintenance(data.MaintenanceRequests)
		if len(open) == 0 {
			return "I do not have verified open maintenance records in your allowed context."
		}
		if user.Role == users.RoleTenant {
			item := open[0]
			return fmt.Sprintf("Your maintenance request %s for %s is %s. Latest update: %s", item.ID, item.Title, strings.ReplaceAll(item.Status, "_", " "), item.LastUpdate)
		}
		return fmt.Sprintf("There are %d open maintenance issues in your allowed scope. Top categories include %s.", len(open), topCategories(open))
	}

	if properties.Contains(text, "portfolio", "performance", "occupancy", "risk", "trends") {
		occupancy := data.Summaries["occupancyPercent"]
		outstanding := data.Summaries["outstandingBalance"]
		return fmt.Sprintf("Across your allowed portfolio, occupancy is %v%% and outstanding balances total %s. Properties with higher maintenance activity should be reviewed first.", occupancy, money(asInt(outstanding)))
	}

	if properties.Contains(text, "unit performing", "income", "my unit", "tenant paid") && len(data.Units) > 0 {
		unit := data.Units[0]
		status := "paid on time"
		if len(data.Payments) > 0 && data.Payments[0].OutstandingBalance > 0 {
			status = "not fully paid"
		}
		return fmt.Sprintf("Unit %s generated %s this month. The tenant is %s. There are %d maintenance items linked to this unit.", unit.UnitNumber, money(unit.MonthlyRent), status, len(openMaintenance(data.MaintenanceRequests)))
	}

	if properties.Contains(text, "board attention", "top building", "building issues") {
		return fmt.Sprintf("There are %d open building-level maintenance items in your allowed context. The most common categories are %s. Items with high priority need board attention.", len(openMaintenance(data.MaintenanceRequests)), topCategories(openMaintenance(data.MaintenanceRequests)))
	}

	if properties.Contains(text, "human", "agent", "escalate") {
		return "I can escalate this conversation to the property management team for human follow-up."
	}

	return "I do not have enough verified property data to answer that. I can escalate this to the property management team.";
}

func shouldEscalate(question string, answer string) bool {
	return properties.Contains(question, "human", "agent", "escalate", "emergency", "legal", "dispute") || strings.Contains(answer, "do not have enough verified")
}

func missingData() string {
	return "I do not have enough verified property data to answer that. I can escalate this to the property management team."
}

func openMaintenance(requests []properties.MaintenanceRequest) []properties.MaintenanceRequest {
	var out []properties.MaintenanceRequest
	for _, request := range requests {
		if request.Status != "resolved" {
			out = append(out, request)
		}
	}
	return out
}

func topCategories(requests []properties.MaintenanceRequest) string {
	if len(requests) == 0 {
		return "none"
	}
	seen := []string{}
	counted := map[string]bool{}
	for _, request := range requests {
		if !counted[request.Category] {
			seen = append(seen, request.Category)
			counted[request.Category] = true
		}
	}
	return strings.Join(seen, ", ")
}

func money(value int) string {
	return fmt.Sprintf("$%d", value)
}

func asInt(value interface{}) int {
	if number, ok := value.(int); ok {
		return number
	}
	return 0
}
