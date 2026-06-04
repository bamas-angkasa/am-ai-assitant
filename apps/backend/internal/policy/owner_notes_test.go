package policy

import "testing"

func TestIsOwnerOnlyNote(t *testing.T) {
	if !IsOwnerOnlyNote(" # Owner wants approval above $500") {
		t.Fatal("expected note starting with # after whitespace to be owner-only")
	}

	if IsOwnerOnlyNote("Tenant says the leak is worse") {
		t.Fatal("expected public maintenance note to remain public")
	}
}

func TestPublicNotesFiltersOwnerOnlyNotes(t *testing.T) {
	notes := []Note{
		{ID: "public", Body: "Vendor scheduled for Friday"},
		{ID: "owner", Body: "# Owner approval required"},
	}

	public := PublicNotes(notes)
	if len(public) != 1 || public[0].ID != "public" {
		t.Fatalf("expected only public note, got %#v", public)
	}
}
