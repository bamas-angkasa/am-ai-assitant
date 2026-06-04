package matcher

import "testing"

func TestMatchByExternalID(t *testing.T) {
	workOrder, ok := Match(
		Message{Subject: "Re: WO-100 leak update"},
		[]WorkOrder{{ID: "1", ExternalID: "WO-100"}},
	)

	if !ok || workOrder.ID != "1" {
		t.Fatalf("expected work order match by external id, got %#v %v", workOrder, ok)
	}
}

func TestMatchBySenderEmail(t *testing.T) {
	workOrder, ok := Match(
		Message{SenderEmail: "tenant@example.com"},
		[]WorkOrder{{ID: "1", TenantEmail: "Tenant@Example.com"}},
	)

	if !ok || workOrder.ID != "1" {
		t.Fatalf("expected work order match by sender email, got %#v %v", workOrder, ok)
	}
}
