package httpapi

import (
	"encoding/json"
	"net/http"

	"appfolio-ai/backend/internal/ai"
	"appfolio-ai/backend/internal/approval"
	"appfolio-ai/backend/internal/audit"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	mux.HandleFunc("GET /api/work-orders", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, []map[string]string{})
	})

	mux.HandleFunc("GET /api/messages", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, []map[string]string{})
	})

	mux.HandleFunc("POST /api/ai/recommendations", func(w http.ResponseWriter, r *http.Request) {
		rec := ai.Recommendation{
			Summary:           "Scaffold recommendation awaiting provider integration.",
			Intent:            "status_update_request",
			Urgency:           "medium",
			RecommendedAction: "review_and_edit_copy_ready_draft",
			SuggestedReply:    "Thanks for the update. We are reviewing this maintenance request and will follow up shortly.",
			Confidence:        "medium",
			RiskFlags:         []string{},
		}

		writeJSON(w, http.StatusCreated, rec)
	})

	mux.HandleFunc("POST /api/approvals/{recommendationId}/approve", func(w http.ResponseWriter, r *http.Request) {
		result, err := approval.Transition(approval.Pending, approval.Approve)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}

		writeJSON(w, http.StatusOK, map[string]string{"status": string(result)})
	})

	mux.HandleFunc("GET /api/audit-logs", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, []audit.Event{})
	})

	return mux
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(value); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
