package ai

import "testing"

func TestParseRecommendationRequiresStructuredFields(t *testing.T) {
	payload := []byte(`{
		"summary":"Tenant needs leak update",
		"intent":"status_update_request",
		"urgency":"medium",
		"recommended_action":"reply_with_eta",
		"suggested_reply":"The vendor is scheduled for Friday.",
		"confidence":"high",
		"risk_flags":[]
	}`)

	recommendation, err := ParseRecommendation(payload)
	if err != nil {
		t.Fatal(err)
	}

	if recommendation.Intent != "status_update_request" {
		t.Fatalf("unexpected intent %q", recommendation.Intent)
	}
}

func TestParseRecommendationRejectsIncompleteOutput(t *testing.T) {
	_, err := ParseRecommendation([]byte(`{"summary":"Missing fields"}`))
	if err != ErrIncompleteRecommendation {
		t.Fatalf("expected incomplete recommendation error, got %v", err)
	}
}
