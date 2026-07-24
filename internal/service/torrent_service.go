package service

import "github.com/bymoxb/metatorrent/internal/domain"

type TorrentService struct {
	repository domain.TorrentClient
}

func NewTorrentService(repository domain.TorrentClient) *TorrentService {
	return &TorrentService{
		repository: repository,
	}
}

func (self *TorrentService) ExtractMetadata(url string) (*domain.Metadata, error) {
	return self.repository.ExtractMetadata(url)
}
