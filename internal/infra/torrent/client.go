package torrent

import (
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/anacrolix/torrent"
	"github.com/anacrolix/torrent/metainfo"
	"github.com/bymoxb/metatorrent/internal/domain"
)

type Client struct {
	client *torrent.Client
}

func New(client *torrent.Client) *Client {
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

	slog.Debug("Awaiting metadata", "name", t.Name())

	<-t.GotInfo()

	slog.Debug("Metadata retrieved", "name", t.Name())

	info := t.Info()
	magnetURL := url

	if !isMagnet {
		mi := t.Metainfo()
		if magv2, err := mi.MagnetV2(); err == nil {
			magnetURL = magv2.String()
		}
	}

	trackers := t.Metainfo().AnnounceList.Clone().DistinctValues()
	if trackers == nil {
		trackers = []string{}
	}

	metadata := &domain.Metadata{
		Name:     info.Name,
		Peers:    t.Stats().TotalPeers,
		Seeds:    t.Stats().ConnectedSeeders,
		Trackers: trackers,
		Size:     info.TotalLength(),
		Magnet:   magnetURL,
		Files:    c.extractFiles(info),
	}

	return metadata, nil
}

func (c *Client) extractFiles(info *metainfo.Info) []domain.File {
	if len(info.Files) == 0 {
		return []domain.File{{
			Path: info.Name,
			Size: info.Length,
		}}
	}

	var files []domain.File
	for _, file := range info.Files {
		path := file.DisplayPath(info)
		if strings.HasPrefix(path, ".pad/") {
			continue
		}
		files = append(files, domain.File{
			Path: path,
			Size: file.Length,
		})
	}
	return files
}

func (c *Client) getTorrent(url string) (t *torrent.Torrent, isMagnet bool, err error) {
	if strings.HasPrefix(url, "magnet:?") {
		t, err = c.client.AddMagnet(url)
		return t, true, err
	}

	if isValidTorrentURL(url) {
		f, err := downloadFile(url)
		if err != nil {
			return nil, false, err
		}

		defer os.Remove(f)

		t, err = c.client.AddTorrentFromFile(f)
		return t, false, err
	}

	return nil, false, fmt.Errorf("unsupported torrent source: %s", url)
}

func downloadFile(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status: %s", resp.Status)
	}

	contentType := resp.Header.Get("Content-Type")
	if !strings.Contains(contentType, "application/x-bittorrent") {
		return "", fmt.Errorf("URL is not a torrent file link")
	}

	tmpFile, err := os.CreateTemp("", "torrent-*")
	if err != nil {
		return "", fmt.Errorf("creating temp file: %w", err)
	}

	const maxTorrentSize = 2 * 1024 * 1024 // 2MB

	limitReader := io.LimitReader(resp.Body, maxTorrentSize+1)

	written, err := io.Copy(tmpFile, limitReader)
	if err != nil {
		tmpFile.Close()
		os.Remove(tmpFile.Name())
		return "", fmt.Errorf("writing to temp file: %w", err)
	}

	if written > maxTorrentSize {
		tmpFile.Close()
		os.Remove(tmpFile.Name())
		return "", fmt.Errorf("torrent file is too large (exceeds %d bytes)", maxTorrentSize)
	}

	tmpFile.Close()
	slog.Debug("Torrent file downloaded", "path", tmpFile.Name())
	return tmpFile.Name(), nil
}

func isValidTorrentURL(rawURL string) bool {
	u, err := url.Parse(rawURL)
	if err != nil {
		return false
	}

	if u.Scheme != "https" {
		return false
	}

	host := u.Hostname()

	if host == "" {
		return false
	}

	if !isAllowedHost(host) {
		return false
	}

	return strings.HasSuffix(u.Path, ".torrent")
}

func isAllowedHost(host string) bool {
	ip := net.ParseIP(host)

	if ip == nil {
		return true
	}

	if ip.IsPrivate() || ip.IsLoopback() || ip.IsLinkLocalUnicast() {
		return false
	}

	return true
}
