package escalation

import (
	"sync"
	"time"
)

type Service struct {
	mu          sync.Mutex
	escalations []Escalation
}

func NewService() *Service {
	return &Service{escalations: []Escalation{
		{ID: "esc_seed_001", UserID: "tenant_001", ConversationID: "conv_seed_001", Reason: "Tenant requested follow-up for kitchen sink issue.", Status: "queued", CreatedAt: "2026-05-21T14:00:00Z"},
	}}
}

func (s *Service) Create(userID string, conversationID string, reason string) Escalation {
	s.mu.Lock()
	defer s.mu.Unlock()
	item := Escalation{
		ID:             "esc_" + time.Now().Format("150405000"),
		UserID:         userID,
		ConversationID: conversationID,
		Reason:         reason,
		Status:         "queued",
		CreatedAt:      time.Now().UTC().Format(time.RFC3339),
	}
	s.escalations = append([]Escalation{item}, s.escalations...)
	return item
}

func (s *Service) All() []Escalation {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]Escalation(nil), s.escalations...)
}
