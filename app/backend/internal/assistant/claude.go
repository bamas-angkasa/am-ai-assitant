package assistant

// Claude integration boundary.
// Stage 1 uses deterministic mock responses unless ANTHROPIC_API_KEY is provided.
// The service keeps Claude behind this package so permission filtering and audit
// logging remain backend-owned and provider-independent.
