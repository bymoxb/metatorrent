package torrent

import (
	"github.com/anacrolix/torrent"
)

func NewAnacrolixClient() (*torrent.Client, error) {
	cfg := torrent.NewDefaultClientConfig()

	cfg.DisableTrackers = true
	cfg.NoUpload = true
	// cfg.MetainfoSourcesClient = &http.Client{
	// 	Timeout: time.Second * 10,
	// }

	// slog.Debug("Creating Torrent Client")

	return torrent.NewClient(cfg)
}
