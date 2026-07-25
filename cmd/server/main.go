package main

import (
	"log/slog"
	"os"

	"github.com/bymoxb/metatorrent/internal/infra/app"
)

func main() {
	handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})
	loffer := slog.New(handler)

	slog.SetDefault(loffer)

	app, err := app.NewApp()

	if err != nil {
		slog.Error("Failed to initialize app", "error", err)
		os.Exit(1)
	}

	defer app.Close()

	if err := app.Run(); err != nil {
		slog.Error("Failed to run app", "error", err)
		os.Exit(1)
	}
}
