package http

import (
	assistantservice "ai-asset-management-assistant/backend/internal/assistant"
	"ai-asset-management-assistant/backend/internal/audit"
	"ai-asset-management-assistant/backend/internal/conversations"
	"ai-asset-management-assistant/backend/internal/escalation"
	"ai-asset-management-assistant/backend/internal/permissions"
	"ai-asset-management-assistant/backend/internal/properties"
	"ai-asset-management-assistant/backend/internal/users"
	"encoding/json"
	"net/http"
	"strings"
)

type Server struct {
	users         *users.Repository
	properties    *properties.Repository
	conversations *conversations.Repository
	audit         *audit.Logger
	escalations   *escalation.Service
	assistant     *assistantservice.Service
}

func NewServer(
	usersRepo *users.Repository,
	propertiesRepo *properties.Repository,
	conversationsRepo *conversations.Repository,
	auditLogger *audit.Logger,
	escalationService *escalation.Service,
	assistantSvc *assistantservice.Service,
) *Server {
	return &Server{users: usersRepo, properties: propertiesRepo, conversations: conversationsRepo, audit: auditLogger, escalations: escalationService, assistant: assistantSvc}
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.health)
	mux.HandleFunc("POST /auth/mock-login", s.mockLogin)
	mux.HandleFunc("GET /auth/me", s.me)
	mux.HandleFunc("GET /roles", s.roles)
	mux.HandleFunc("GET /properties", s.propertiesIndex)
	mux.HandleFunc("GET /properties/", s.propertyShow)
	mux.HandleFunc("POST /chat", s.chat)
	mux.HandleFunc("GET /conversations", s.conversationIndex)
	mux.HandleFunc("GET /conversations/", s.conversationShow)
	mux.HandleFunc("GET /audit-logs", s.auditIndex)
	mux.HandleFunc("GET /admin/overview", s.adminOverview)
	mux.HandleFunc("GET /admin/escalations", s.escalationIndex)
	mux.HandleFunc("GET /maintenance-requests", s.maintenanceIndex)
	mux.HandleFunc("POST /maintenance-requests", s.maintenanceCreate)
	mux.HandleFunc("POST /escalations", s.escalationCreate)
	return cors(mux)
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) mockLogin(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UserID string `json:"userId"`
		Role   string `json:"role"`
	}
	_ = json.NewDecoder(r.Body).Decode(&request)
	if request.UserID == "" && request.Role != "" {
		for _, user := range s.users.All() {
			if string(user.Role) == request.Role {
				writeJSON(w, http.StatusOK, user)
				return
			}
		}
	}
	user, ok := s.users.ByID(request.UserID)
	if !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) me(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		userID = "tenant_001"
	}
	user, ok := s.users.ByID(userID)
	if !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) roles(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.users.All())
}

func (s *Server) propertiesIndex(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		writeJSON(w, http.StatusOK, s.properties.AllProperties())
		return
	}
	user, ok := s.users.ByID(userID)
	if !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, permissions.Filter(user, s.properties.AllData()))
}

func (s *Server) propertyShow(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/properties/")
	property, ok := s.properties.PropertyByID(id)
	if !ok {
		writeError(w, http.StatusNotFound, "property not found")
		return
	}
	writeJSON(w, http.StatusOK, property)
}

func (s *Server) chat(w http.ResponseWriter, r *http.Request) {
	var request assistantservice.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid chat request")
		return
	}
	response, err := s.assistant.Chat(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, response)
}

func (s *Server) conversationIndex(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.conversations.All())
}

func (s *Server) conversationShow(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/conversations/")
	conversation, ok := s.conversations.ByID(id)
	if !ok {
		writeError(w, http.StatusNotFound, "conversation not found")
		return
	}
	writeJSON(w, http.StatusOK, conversation)
}

func (s *Server) auditIndex(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.audit.All())
}

func (s *Server) adminOverview(w http.ResponseWriter, r *http.Request) {
	data := s.properties.AllData()
	openMaintenance := 0
	overduePayments := 0
	for _, request := range data.MaintenanceRequests {
		if request.Status != "resolved" {
			openMaintenance++
		}
	}
	for _, payment := range data.Payments {
		if payment.OutstandingBalance > 0 {
			overduePayments++
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"openMaintenanceIssues": openMaintenance,
		"overduePayments":       overduePayments,
		"escalatedConversations": len(s.escalations.All()),
		"recentAIResponses":      len(s.audit.All()),
		"auditLogs":             s.audit.All(),
		"conversations":         s.conversations.All(),
		"escalations":           s.escalations.All(),
	})
}

func (s *Server) escalationIndex(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.escalations.All())
}

func (s *Server) maintenanceIndex(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	data := s.properties.AllData()
	if userID != "" {
		if user, ok := s.users.ByID(userID); ok {
			data = permissions.Filter(user, data)
		}
	}
	writeJSON(w, http.StatusOK, data.MaintenanceRequests)
}

func (s *Server) maintenanceCreate(w http.ResponseWriter, r *http.Request) {
	var request properties.MaintenanceRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid maintenance request")
		return
	}
	writeJSON(w, http.StatusCreated, s.properties.AddMaintenanceRequest(request))
}

func (s *Server) escalationCreate(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UserID         string `json:"userId"`
		ConversationID string `json:"conversationId"`
		Reason         string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid escalation request")
		return
	}
	writeJSON(w, http.StatusCreated, s.escalations.Create(request.UserID, request.ConversationID, request.Reason))
}

func writeJSON(w http.ResponseWriter, status int, value interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
