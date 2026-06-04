package approval

import "errors"

type Status string

const (
	Pending  Status = "pending"
	Approved Status = "approved"
	Rejected Status = "rejected"
	Edited   Status = "edited"
)

type Action string

const (
	Approve Action = "approve"
	Reject  Action = "reject"
	Edit    Action = "edit"
)

var ErrInvalidTransition = errors.New("invalid approval transition")

func Transition(current Status, action Action) (Status, error) {
	if current != Pending && current != Edited {
		return current, ErrInvalidTransition
	}

	switch action {
	case Approve:
		return Approved, nil
	case Reject:
		return Rejected, nil
	case Edit:
		return Edited, nil
	default:
		return current, ErrInvalidTransition
	}
}
