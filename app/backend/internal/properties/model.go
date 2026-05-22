package properties

type Property struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Address       string   `json:"address"`
	TotalUnits    int      `json:"totalUnits"`
	OccupiedUnits int      `json:"occupiedUnits"`
	OwnerID       string   `json:"ownerId"`
	BoardIDs      []string `json:"boardIds"`
}

type Unit struct {
	ID          string `json:"id"`
	PropertyID  string `json:"propertyId"`
	UnitNumber  string `json:"unitNumber"`
	OwnerID     string `json:"ownerId"`
	TenantID    string `json:"tenantId,omitempty"`
	MonthlyRent int    `json:"monthlyRent"`
	Status      string `json:"status"`
}

type Lease struct {
	ID        string `json:"id"`
	TenantID  string `json:"tenantId"`
	UnitID    string `json:"unitId"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	Status    string `json:"status"`
}

type Payment struct {
	ID                 string `json:"id"`
	TenantID           string `json:"tenantId"`
	UnitID             string `json:"unitId"`
	Period             string `json:"period"`
	AmountDue          int    `json:"amountDue"`
	AmountPaid         int    `json:"amountPaid"`
	OutstandingBalance int    `json:"outstandingBalance"`
	DueDate            string `json:"dueDate"`
	Status             string `json:"status"`
}

type MaintenanceRequest struct {
	ID          string `json:"id"`
	PropertyID  string `json:"propertyId"`
	UnitID      string `json:"unitId,omitempty"`
	ReportedBy  string `json:"reportedBy"`
	Category    string `json:"category"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Priority    string `json:"priority"`
	LastUpdate  string `json:"lastUpdate"`
	CreatedAt   string `json:"createdAt"`
}

type AllowedData struct {
	Properties          []Property             `json:"properties"`
	Units               []Unit                 `json:"units"`
	Leases              []Lease                `json:"leases"`
	Payments            []Payment              `json:"payments"`
	MaintenanceRequests []MaintenanceRequest   `json:"maintenanceRequests"`
	Summaries           map[string]interface{} `json:"summaries"`
}
