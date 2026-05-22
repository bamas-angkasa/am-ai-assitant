package main

import (
	"ai-asset-management-assistant/backend/internal/assistant"
	"ai-asset-management-assistant/backend/internal/audit"
	"ai-asset-management-assistant/backend/internal/config"
	"ai-asset-management-assistant/backend/internal/conversations"
	apihttp "ai-asset-management-assistant/backend/internal/http"
	"ai-asset-management-assistant/backend/internal/escalation"
	"ai-asset-management-assistant/backend/internal/properties"
	"ai-asset-management-assistant/backend/internal/users"
	"log"
	"net/http"
)

func main() {
	cfg := config.Load()
	usersRepo := users.NewRepository()
	propertiesRepo := properties.NewRepository()
	conversationRepo := conversations.NewRepository()
	auditLogger := audit.NewLogger()
	escalationService := escalation.NewService()
	assistantService := assistant.NewService(usersRepo, propertiesRepo, conversationRepo, auditLogger, escalationService)
	server := apihttp.NewServer(usersRepo, propertiesRepo, conversationRepo, auditLogger, escalationService, assistantService)

	log.Printf("AI Asset Management Assistant API listening on :%s (mockAI=%v provider=%s)", cfg.Port, cfg.MockAI, cfg.AIProvider)
	if err := http.ListenAndServe(":"+cfg.Port, server.Routes()); err != nil {
		log.Fatal(err)
	}
}
