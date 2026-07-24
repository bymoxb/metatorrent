package torrent

import (
	"github.com/anacrolix/torrent"
	"github.com/bymoxb/metatorrent/internal/infra/config"
)

func NewAnacrolixClient(cfg *config.Config) (*torrent.Client, error) {

	anacrolixcfg := torrent.NewDefaultClientConfig()

	anacrolixcfg.DisableTrackers = true
	anacrolixcfg.NoUpload = true
	// cfg.MetainfoSourcesClient = &http.Client{
	// 	Timeout: time.Second * 10,
	// }

	// slog.Debug("Creating Torrent Client")

	return torrent.NewClient(anacrolixcfg)
}
