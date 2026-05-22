package properties

import (
	"strings"
	"sync"
	"time"
)

type Repository struct {
	mu                  sync.Mutex
	properties          []Property
	units               []Unit
	leases              []Lease
	payments            []Payment
	maintenanceRequests []MaintenanceRequest
}

func NewRepository() *Repository {
	return &Repository{
		properties: []Property{
			{ID: "prop_scbd", Name: "Luxury Apartment SCBD", Address: "12 Sudirman Central Business District", TotalUnits: 120, OccupiedUnits: 114, OwnerID: "owner_portfolio", BoardIDs: []string{"board_scbd"}},
			{ID: "prop_riverside", Name: "Riverside Residence", Address: "88 Riverfront Avenue", TotalUnits: 80, OccupiedUnits: 76, OwnerID: "owner_portfolio", BoardIDs: []string{"board_river"}},
			{ID: "prop_greenview", Name: "Greenview Townhouse", Address: "44 Greenview Lane", TotalUnits: 36, OccupiedUnits: 34, OwnerID: "owner_greenview", BoardIDs: []string{"board_greenview"}},
			{ID: "prop_loft", Name: "Central Business Loft", Address: "19 Commerce Street", TotalUnits: 48, OccupiedUnits: 42, OwnerID: "owner_portfolio", BoardIDs: []string{"board_loft"}},
		},
		units: []Unit{
			{ID: "unit_12a", PropertyID: "prop_scbd", UnitNumber: "12A", OwnerID: "owner_unit_001", TenantID: "tenant_001", MonthlyRent: 1250, Status: "occupied"},
			{ID: "unit_9c", PropertyID: "prop_scbd", UnitNumber: "9C", OwnerID: "owner_unit_002", TenantID: "tenant_002", MonthlyRent: 1425, Status: "occupied"},
			{ID: "unit_3b", PropertyID: "prop_riverside", UnitNumber: "3B", OwnerID: "owner_portfolio", TenantID: "tenant_003", MonthlyRent: 1750, Status: "occupied"},
			{ID: "unit_7d", PropertyID: "prop_loft", UnitNumber: "7D", OwnerID: "owner_portfolio", MonthlyRent: 1600, Status: "vacant"},
		},
		leases: []Lease{
			{ID: "lease_001", TenantID: "tenant_001", UnitID: "unit_12a", StartDate: "2025-08-01", EndDate: "2026-07-31", Status: "active"},
			{ID: "lease_002", TenantID: "tenant_002", UnitID: "unit_9c", StartDate: "2025-11-01", EndDate: "2026-10-31", Status: "active"},
			{ID: "lease_003", TenantID: "tenant_003", UnitID: "unit_3b", StartDate: "2025-05-01", EndDate: "2026-04-30", Status: "active"},
		},
		payments: []Payment{
			{ID: "rent_001", TenantID: "tenant_001", UnitID: "unit_12a", Period: "May 2026", AmountDue: 1250, AmountPaid: 0, OutstandingBalance: 1250, DueDate: "2026-05-25", Status: "pending"},
			{ID: "rent_002", TenantID: "tenant_002", UnitID: "unit_9c", Period: "May 2026", AmountDue: 1425, AmountPaid: 1425, OutstandingBalance: 0, DueDate: "2026-05-05", Status: "paid"},
			{ID: "rent_003", TenantID: "tenant_003", UnitID: "unit_3b", Period: "May 2026", AmountDue: 1750, AmountPaid: 900, OutstandingBalance: 850, DueDate: "2026-05-05", Status: "partially_paid"},
		},
		maintenanceRequests: []MaintenanceRequest{
			{ID: "maint_001", PropertyID: "prop_scbd", UnitID: "unit_12a", ReportedBy: "tenant_001", Category: "plumbing", Title: "Kitchen sink leaking", Description: "Kitchen sink has a slow leak under the cabinet.", Status: "in_progress", Priority: "medium", LastUpdate: "Vendor visit is scheduled for May 24.", CreatedAt: "2026-05-12"},
			{ID: "maint_002", PropertyID: "prop_scbd", Category: "elevator", Title: "Elevator intermittent outage", Description: "Elevator B stopped twice this week.", Status: "open", Priority: "high", LastUpdate: "Awaiting vendor diagnostic.", CreatedAt: "2026-05-18"},
			{ID: "maint_003", PropertyID: "prop_riverside", Category: "parking", Title: "Parking gate access issue", Description: "Several tenants reported key fob failures.", Status: "open", Priority: "medium", LastUpdate: "Access vendor requested logs.", CreatedAt: "2026-05-19"},
			{ID: "maint_004", PropertyID: "prop_greenview", Category: "landscaping", Title: "Common area irrigation leak", Description: "Irrigation line leaking near entrance.", Status: "resolved", Priority: "low", LastUpdate: "Repair completed May 20.", CreatedAt: "2026-05-15"},
		},
	}
}

func (r *Repository) AllProperties() []Property {
	return append([]Property(nil), r.properties...)
}

func (r *Repository) PropertyByID(id string) (Property, bool) {
	for _, property := range r.properties {
		if property.ID == id {
			return property, true
		}
	}
	return Property{}, false
}

func (r *Repository) AllData() AllowedData {
	return AllowedData{
		Properties:          append([]Property(nil), r.properties...),
		Units:               append([]Unit(nil), r.units...),
		Leases:              append([]Lease(nil), r.leases...),
		Payments:            append([]Payment(nil), r.payments...),
		MaintenanceRequests: append([]MaintenanceRequest(nil), r.maintenanceRequests...),
		Summaries:           r.Summaries(r.properties, r.units, r.payments, r.maintenanceRequests),
	}
}

func (r *Repository) AddMaintenanceRequest(request MaintenanceRequest) MaintenanceRequest {
	r.mu.Lock()
	defer r.mu.Unlock()
	if request.ID == "" {
		request.ID = "maint_" + time.Now().Format("150405")
	}
	if request.Status == "" {
		request.Status = "open"
	}
	if request.CreatedAt == "" {
		request.CreatedAt = time.Now().UTC().Format(time.RFC3339)
	}
	r.maintenanceRequests = append(r.maintenanceRequests, request)
	return request
}

func (r *Repository) Summaries(properties []Property, units []Unit, payments []Payment, requests []MaintenanceRequest) map[string]interface{} {
	outstanding := 0
	for _, payment := range payments {
		outstanding += payment.OutstandingBalance
	}
	openMaintenance := 0
	categories := map[string]int{}
	for _, request := range requests {
		if request.Status != "resolved" {
			openMaintenance++
			categories[request.Category]++
		}
	}
	totalUnits := 0
	occupiedUnits := 0
	for _, property := range properties {
		totalUnits += property.TotalUnits
		occupiedUnits += property.OccupiedUnits
	}
	occupancy := 0
	if totalUnits > 0 {
		occupancy = occupiedUnits * 100 / totalUnits
	}
	return map[string]interface{}{
		"outstandingBalance": outstanding,
		"openMaintenance":    openMaintenance,
		"maintenanceByType":  categories,
		"occupancyPercent":   occupancy,
		"propertyCount":      len(properties),
		"unitCount":          len(units),
	}
}

func Contains(text string, needles ...string) bool {
	text = strings.ToLower(text)
	for _, needle := range needles {
		if strings.Contains(text, strings.ToLower(needle)) {
			return true
		}
	}
	return false
}
