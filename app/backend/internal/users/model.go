package users

type Role string

const (
	RoleTenant        Role = "tenant"
	RoleUnitOwner     Role = "unit_owner"
	RoleHOABoard      Role = "hoa_board"
	RoleBuildingOwner Role = "building_owner"
	RoleAdmin         Role = "admin"
)

type User struct {
	ID                string   `json:"id"`
	Name              string   `json:"name"`
	Email             string   `json:"email"`
	Role              Role     `json:"role"`
	DisplayRole       string   `json:"displayRole"`
	AccessDescription string   `json:"accessDescription"`
	TenantID          string   `json:"tenantId,omitempty"`
	OwnerID           string   `json:"ownerId,omitempty"`
	BoardID           string   `json:"boardId,omitempty"`
	BuildingIDs       []string `json:"buildingIds,omitempty"`
	UnitIDs           []string `json:"unitIds,omitempty"`
}
