package approval

import "testing"

func TestTransitionApprovesPendingRecommendation(t *testing.T) {
	status, err := Transition(Pending, Approve)
	if err != nil {
		t.Fatal(err)
	}

	if status != Approved {
		t.Fatalf("expected approved, got %s", status)
	}
}

func TestTransitionRejectsAlreadyApprovedRecommendation(t *testing.T) {
	_, err := Transition(Approved, Reject)
	if err != ErrInvalidTransition {
		t.Fatalf("expected invalid transition, got %v", err)
	}
}
