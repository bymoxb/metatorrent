package torrent

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/anacrolix/torrent"
	anatorrent "github.com/anacrolix/torrent"

	"github.com/bymoxb/metatorrent/internal/domain"
)

type Client struct {
	client *anatorrent.Client
}

func New(client *anatorrent.Client) *Client {
	return &Client{
		client: client,
	}
}

func (c *Client) ExtractMetadata(url string) (*domain.Metadata, error) {

	t, isMagnet, err := c.getTorrent(url)

	if err != nil {
		return nil, err
	}

	defer t.Drop()

	slog.Debug("Getting file ", "name", t.Name())
	// fmt.Printf("stats1: %+v\n", t.Stats())
	<-t.GotInfo()
	// fmt.Printf("stats2: %+v\n", t.Stats())
	slog.Debug("Metadata retrieved ", "name", t.Name())

	info := t.Info()

	mag := url

	if !isMagnet {
		mi := t.Metainfo()
		if magv2, err := mi.MagnetV2(); err == nil {
			mag = magv2.String()
		}
	}

	response := domain.Metadata{
		Name:     info.Name,
		Peers:    t.Stats().TotalPeers,
		Seeds:    t.Stats().ConnectedSeeders,
		Trackers: []string{},
		Files:    []domain.File{},
		Size:     info.TotalLength(),
		Magnet:   mag,
	}

	for _, tracker := range t.Metainfo().AnnounceList.Clone().DistinctValues() {
		response.Trackers = append(response.Trackers, tracker)
	}

	if len(info.Files) > 0 {
		for _, file := range info.Files {

			if strings.HasPrefix(file.DisplayPath(info), ".pad/") {
				continue
			}

			response.Files = append(response.Files,
				domain.File{
					Path: file.DisplayPath(info),
					Size: file.Length,
				},
			)

		}
	} else {
		response.Files = []domain.File{{
			Path: info.Name,
			Size: info.Length,
		}}
	}

	return &response, nil

}

func (s *Client) getTorrent(url string) (*torrent.Torrent, bool, error) {
	if strings.HasPrefix(url, "magnet:?") {
		t, err := s.client.AddMagnet(url)
		return t, true, err
	} else if strings.HasSuffix(url, ".torrent") {
		f, err := downloadFile(url)
		if err != nil {
			return nil, false, fmt.Errorf("Error downloading .torrent file")
		}

		defer func() {
			slog.Debug("Deleting torrent file", "path", f)
			os.Remove(f)
			slog.Debug("Deleted torrent file", "path", f)
		}()
		t, err := s.client.AddTorrentFromFile(f)
		return t, false, err
	}

	return nil, false, fmt.Errorf("Not implement torrent type")
}

func downloadFile(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("status code: %d", resp.StatusCode)
	}

	tmpFile, err := os.CreateTemp("", "upload-*")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	_, err = io.Copy(tmpFile, resp.Body)
	if err != nil {
		os.Remove(tmpFile.Name())
		return "", err
	}

	slog.Debug("Torrent file downloaded", "path", tmpFile.Name())
	return tmpFile.Name(), nil
}
