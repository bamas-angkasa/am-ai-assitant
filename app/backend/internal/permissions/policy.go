package permissions

import (
	"ai-asset-management-assistant/backend/internal/audit"
	"ai-asset-management-assistant/backend/internal/properties"
	"ai-asset-management-assistant/backend/internal/users"
)

type Result struct {
	Allowed bool
	Reason  string
	Sources []audit.Source
	Scopes  []string
}

func Filter(user users.User, data properties.AllowedData) properties.AllowedData {
	switch user.Role {
	case users.RoleAdmin:
		return data
	case users.RoleBuildingOwner:
		return filterByBuildings(user.BuildingIDs, data, true, true)
	case users.RoleHOABoard:
		filtered := filterByBuildings(user.BuildingIDs, data, false, true)
		filtered.Units = nil
		filtered.Leases = nil
		filtered.Payments = nil
		filtered.MaintenanceRequests = onlyCommonArea(filtered.MaintenanceRequests)
		filtered.Summaries = summarize(filtered)
		return filtered
	case users.RoleUnitOwner:
		return filterByUnits(user.UnitIDs, data, true)
	default:
		return filterByUnits(user.UnitIDs, data, true)
	}
}

func Check(user users.User, question string, allowed properties.AllowedData) Result {
	sources := sourceRefs(allowed)
	scopes := dataScopes(allowed)

	if properties.Contains(question, "tenant", "payment", "rent", "overdue", "paid") && user.Role == users.RoleHOABoard {
		return Result{Allowed: false, Reason: "HOA / Board members cannot access private tenant payment details.", Sources: nil, Scopes: scopes}
	}
	if properties.Contains(question, "another tenant", "other tenant", "unit 9c", "9c") && user.Role == users.RoleTenant {
		return Result{Allowed: false, Reason: "Tenants can only access their own unit, lease, payment, and maintenance records.", Sources: nil, Scopes: scopes}
	}
	if len(allowed.Properties) == 0 && len(allowed.Units) == 0 && len(allowed.MaintenanceRequests) == 0 {
		return Result{Allowed: false, Reason: "No property records are available in this user's authorized scope.", Sources: nil, Scopes: scopes}
	}
	return Result{Allowed: true, Reason: "Allowed context is filtered to the selected user's role and property scope.", Sources: sources, Scopes: scopes}
}

func filterByBuildings(ids []string, data properties.AllowedData, includePrivate bool, includeMaintenance bool) properties.AllowedData {
	idSet := set(ids)
	var props []properties.Property
	var units []properties.Unit
	var unitIDs []string
	for _, property := range data.Properties {
		if idSet[property.ID] {
			props = append(props, property)
		}
	}
	for _, unit := range data.Units {
		if idSet[unit.PropertyID] {
			units = append(units, unit)
			unitIDs = append(unitIDs, unit.ID)
		}
	}
	filtered := properties.AllowedData{Properties: props, Units: units}
	if includePrivate {
		filtered.Leases = filterLeases(unitIDs, data.Leases)
		filtered.Payments = filterPayments(unitIDs, data.Payments)
	}
	if includeMaintenance {
		for _, request := range data.MaintenanceRequests {
			if idSet[request.PropertyID] {
				filtered.MaintenanceRequests = append(filtered.MaintenanceRequests, request)
			}
		}
	}
	filtered.Summaries = summarize(filtered)
	return filtered
}

func filterByUnits(ids []string, data properties.AllowedData, includePrivate bool) properties.AllowedData {
	idSet := set(ids)
	propertyIDs := map[string]bool{}
	var units []properties.Unit
	for _, unit := range data.Units {
		if idSet[unit.ID] {
			units = append(units, unit)
			propertyIDs[unit.PropertyID] = true
		}
	}
	var props []properties.Property
	for _, property := range data.Properties {
		if propertyIDs[property.ID] {
			props = append(props, property)
		}
	}
	filtered := properties.AllowedData{Properties: props, Units: units}
	if includePrivate {
		filtered.Leases = filterLeases(ids, data.Leases)
		filtered.Payments = filterPayments(ids, data.Payments)
	}
	for _, request := range data.MaintenanceRequests {
		if idSet[request.UnitID] {
			filtered.MaintenanceRequests = append(filtered.MaintenanceRequests, request)
		}
	}
	filtered.Summaries = summarize(filtered)
	return filtered
}

func filterLeases(unitIDs []string, leases []properties.Lease) []properties.Lease {
	idSet := set(unitIDs)
	var out []properties.Lease
	for _, lease := range leases {
		if idSet[lease.UnitID] {
			out = append(out, lease)
		}
	}
	return out
}

func filterPayments(unitIDs []string, payments []properties.Payment) []properties.Payment {
	idSet := set(unitIDs)
	var out []properties.Payment
	for _, payment := range payments {
		if idSet[payment.UnitID] {
			out = append(out, payment)
		}
	}
	return out
}

func onlyCommonArea(requests []properties.MaintenanceRequest) []properties.MaintenanceRequest {
	var out []properties.MaintenanceRequest
	for _, request := range requests {
		if request.UnitID == "" {
			out = append(out, request)
		}
	}
	return out
}

func countOpen(requests []properties.MaintenanceRequest) int {
	total := 0
	for _, request := range requests {
		if request.Status != "resolved" {
			total++
		}
	}
	return total
}

func categoryCounts(requests []properties.MaintenanceRequest) map[string]int {
	counts := map[string]int{}
	for _, request := range requests {
		if request.Status != "resolved" {
			counts[request.Category]++
		}
	}
	return counts
}

func summarize(data properties.AllowedData) map[string]interface{} {
	outstanding := 0
	for _, payment := range data.Payments {
		outstanding += payment.OutstandingBalance
	}
	totalUnits := 0
	occupiedUnits := 0
	for _, property := range data.Properties {
		totalUnits += property.TotalUnits
		occupiedUnits += property.OccupiedUnits
	}
	occupancy := 0
	if totalUnits > 0 {
		occupancy = occupiedUnits * 100 / totalUnits
	}
	return map[string]interface{}{
		"outstandingBalance": outstanding,
		"openMaintenance":    countOpen(data.MaintenanceRequests),
		"maintenanceByType":  categoryCounts(data.MaintenanceRequests),
		"occupancyPercent":   occupancy,
		"propertyCount":      len(data.Properties),
		"unitCount":          len(data.Units),
	}
}

func sourceRefs(data properties.AllowedData) []audit.Source {
	var sources []audit.Source
	for _, payment := range data.Payments {
		sources = append(sources, audit.Source{Type: "rent_balance", ID: payment.ID})
	}
	for _, request := range data.MaintenanceRequests {
		sources = append(sources, audit.Source{Type: "maintenance_request", ID: request.ID})
	}
	for _, property := range data.Properties {
		sources = append(sources, audit.Source{Type: "property", ID: property.ID})
	}
	return sources
}

func dataScopes(data properties.AllowedData) []string {
	return []string{
		"properties", "units", "leases", "payments", "maintenance_requests", "summaries",
	}
}

func set(ids []string) map[string]bool {
	out := map[string]bool{}
	for _, id := range ids {
		out[id] = true
	}
	return out
}
