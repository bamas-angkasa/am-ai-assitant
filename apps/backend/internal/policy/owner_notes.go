package policy

import "strings"

type Note struct {
	ID      string
	Body    string
	Author  string
	Created string
}

func IsOwnerOnlyNote(body string) bool {
	return strings.HasPrefix(strings.TrimSpace(body), "#")
}

func PublicNotes(notes []Note) []Note {
	public := make([]Note, 0, len(notes))

	for _, note := range notes {
		if IsOwnerOnlyNote(note.Body) {
			continue
		}

		public = append(public, note)
	}

	return public
}
