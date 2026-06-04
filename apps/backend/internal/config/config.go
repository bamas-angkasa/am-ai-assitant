package config

import "os"

type Config struct {
	AppEnv      string
	Port        string
	DatabaseURL string
	RedisURL    string
}

func Load() Config {
	return Config{
		AppEnv:      env("APP_ENV", "local"),
		Port:        env("APP_PORT", "8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),
	}
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}
