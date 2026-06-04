package ai

import "encoding/json"

type Recommendation struct {
	Summary           string   `json:"summary"`
	Intent            string   `json:"intent"`
	Urgency           string   `json:"urgency"`
	RecommendedAction string   `json:"recommended_action"`
	SuggestedReply    string   `json:"suggested_reply"`
	Confidence        string   `json:"confidence"`
	RiskFlags         []string `json:"risk_flags"`
}

func ParseRecommendation(payload []byte) (Recommendation, error) {
	var recommendation Recommendation
	if err := json.Unmarshal(payload, &recommendation); err != nil {
		return Recommendation{}, err
	}

	return recommendation, recommendation.Validate()
}

func (r Recommendation) Validate() error {
	if r.Summary == "" || r.Intent == "" || r.Urgency == "" || r.RecommendedAction == "" || r.SuggestedReply == "" || r.Confidence == "" {
		return ErrIncompleteRecommendation
	}

	return nil
}
