# AppFolio AI Backend

Go backend scaffold for the AppFolio AI maintenance assistant.

## Run

```bash
go run ./cmd/api
```

The API listens on `APP_PORT`, defaulting to `8080`.

## Test

```bash
go test ./...
```

## Current Modules

- `policy`: owner-only note detection and filtering.
- `matcher`: simple inbound message to work order matching.
- `ai`: structured recommendation parsing and validation.
- `approval`: human approval state transitions.
- `audit`: audit event shape.
