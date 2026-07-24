package domain

type TorrentClient interface {
	ExtractMetadata(url string) (*Metadata, error)
}
