package audit

type Event struct {
	ID        string         `json:"id"`
	Type      string         `json:"type"`
	ActorID   string         `json:"actor_id"`
	EntityID  string         `json:"entity_id"`
	Metadata  map[string]any `json:"metadata"`
	CreatedAt string         `json:"created_at"`
}
