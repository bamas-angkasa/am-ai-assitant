package config

import "os"

type Config struct {
	Port            string
	AnthropicAPIKey string
	AIProvider      string
	MockAI          bool
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	mockAI := os.Getenv("MOCK_AI") != "false"
	return Config{
		Port:            port,
		AnthropicAPIKey: os.Getenv("ANTHROPIC_API_KEY"),
		AIProvider:      env("AI_PROVIDER", "claude"),
		MockAI:          mockAI || os.Getenv("ANTHROPIC_API_KEY") == "",
	}
}

func env(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
