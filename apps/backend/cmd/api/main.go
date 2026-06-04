package main

import (
	"log"
	"net/http"
	"time"

	"appfolio-ai/backend/internal/config"
	"appfolio-ai/backend/internal/httpapi"
)

func main() {
	cfg := config.Load()

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           httpapi.NewRouter(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("appfolio ai api listening on :%s", cfg.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
