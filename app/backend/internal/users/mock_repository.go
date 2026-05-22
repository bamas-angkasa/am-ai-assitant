package users

type Repository struct {
	users []User
}

func NewRepository() *Repository {
	return &Repository{users: []User{
		{ID: "tenant_001", Name: "Maya Chen", Email: "maya@example.com", Role: RoleTenant, DisplayRole: "Tenant", AccessDescription: "Unit 12A rent, lease, payments, and maintenance only.", TenantID: "tenant_001", UnitIDs: []string{"unit_12a"}, BuildingIDs: []string{"prop_scbd"}},
		{ID: "owner_unit_001", Name: "Jordan Lee", Email: "jordan@example.com", Role: RoleUnitOwner, DisplayRole: "Unit Owner", AccessDescription: "Owned unit 12A performance and related issues.", OwnerID: "owner_unit_001", UnitIDs: []string{"unit_12a"}, BuildingIDs: []string{"prop_scbd"}},
		{ID: "board_scbd", Name: "Ariana Patel", Email: "ariana@example.com", Role: RoleHOABoard, DisplayRole: "HOA / Board Member", AccessDescription: "SCBD building-level operations without private tenant financial details.", BoardID: "board_scbd", BuildingIDs: []string{"prop_scbd"}},
		{ID: "owner_portfolio", Name: "Morgan Rivera", Email: "morgan@example.com", Role: RoleBuildingOwner, DisplayRole: "Building Owner", AccessDescription: "Portfolio-level property performance across assigned buildings.", OwnerID: "owner_portfolio", BuildingIDs: []string{"prop_scbd", "prop_riverside", "prop_loft"}},
		{ID: "admin_001", Name: "Dian Property Admin", Email: "admin@example.com", Role: RoleAdmin, DisplayRole: "Property Manager / Admin", AccessDescription: "Assigned-property operational access, audit logs, and escalations.", BuildingIDs: []string{"prop_scbd", "prop_riverside", "prop_greenview", "prop_loft"}},
	}}
}

func (r *Repository) All() []User {
	return append([]User(nil), r.users...)
}

func (r *Repository) ByID(id string) (User, bool) {
	switch id {
	case "user-tenant-john":
		id = "tenant_001"
	case "user-unit-owner":
		id = "owner_unit_001"
	case "user-board":
		id = "board_scbd"
	case "user-owner":
		id = "owner_portfolio"
	case "user-admin":
		id = "admin_001"
	}
	for _, user := range r.users {
		if user.ID == id {
			return user, true
		}
	}
	return User{}, false
}
