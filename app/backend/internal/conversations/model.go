package conversations

type Conversation struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Role      string    `json:"role"`
	CreatedAt string    `json:"createdAt"`
	UpdatedAt string    `json:"updatedAt"`
	Messages  []Message `json:"messages"`
}

type Message struct {
	ID        string `json:"id"`
	Role      string `json:"role"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
}
