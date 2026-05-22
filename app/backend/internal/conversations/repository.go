package conversations

import (
	"sync"
	"time"
)

type Repository struct {
	mu            sync.Mutex
	conversations map[string]Conversation
}

func NewRepository() *Repository {
	return &Repository{conversations: map[string]Conversation{}}
}

func (r *Repository) AddMessage(conversationID string, userID string, role string, message Message) Conversation {
	r.mu.Lock()
	defer r.mu.Unlock()
	now := time.Now().UTC().Format(time.RFC3339)
	conversation, ok := r.conversations[conversationID]
	if !ok {
		conversation = Conversation{ID: conversationID, UserID: userID, Role: role, CreatedAt: now}
	}
	conversation.Messages = append(conversation.Messages, message)
	conversation.UpdatedAt = now
	r.conversations[conversationID] = conversation
	return conversation
}

func (r *Repository) All() []Conversation {
	r.mu.Lock()
	defer r.mu.Unlock()
	out := make([]Conversation, 0, len(r.conversations))
	for _, conversation := range r.conversations {
		out = append(out, conversation)
	}
	return out
}

func (r *Repository) ByID(id string) (Conversation, bool) {
	r.mu.Lock()
	defer r.mu.Unlock()
	conversation, ok := r.conversations[id]
	return conversation, ok
}
