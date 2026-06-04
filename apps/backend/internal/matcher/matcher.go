package matcher

import "strings"

type Message struct {
	SenderEmail string
	SenderPhone string
	Subject     string
	Body        string
}

type WorkOrder struct {
	ID          string
	ExternalID  string
	TenantEmail string
	TenantPhone string
	Property    string
	Unit        string
	Status      string
}

func Match(message Message, workOrders []WorkOrder) (WorkOrder, bool) {
	needle := strings.ToLower(message.Subject + " " + message.Body)

	for _, workOrder := range workOrders {
		if workOrder.ExternalID != "" && strings.Contains(needle, strings.ToLower(workOrder.ExternalID)) {
			return workOrder, true
		}

		if sameNormalized(message.SenderEmail, workOrder.TenantEmail) || sameNormalized(message.SenderPhone, workOrder.TenantPhone) {
			return workOrder, true
		}
	}

	return WorkOrder{}, false
}

func sameNormalized(left, right string) bool {
	return left != "" && strings.EqualFold(strings.TrimSpace(left), strings.TrimSpace(right))
}
