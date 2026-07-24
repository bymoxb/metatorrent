package dtos

import "github.com/bymoxb/metatorrent/internal/domain"

type MetadataDTO struct {
	Name     string    `json:"name"`
	Size     int64     `json:"size"`
	Files    []FileDTO `json:"files"`
	Peers    int       `json:"peers"`
	Seeds    int       `json:"seeds"`
	Trackers []string  `json:"trackers"`
	Magnet   string    `json:"magnet"`
}

type FileDTO struct {
	Path string `json:"path"`
	Size int64  `json:"size"`
}

func MapMetadataToDTO(model *domain.Metadata) MetadataDTO {
	if model == nil {
		return MetadataDTO{}
	}

	files := make([]FileDTO, 0, len(model.Files))

	for _, file := range model.Files {
		files = append(files, MapFileToDTO(&file))
	}

	return MetadataDTO{
		Name:     model.Name,
		Size:     model.Size,
		Files:    files,
		Peers:    model.Peers,
		Seeds:    model.Seeds,
		Trackers: model.Trackers,
		Magnet:   model.Magnet,
	}
}

func MapFileToDTO(model *domain.File) FileDTO {
	if model == nil {
		return FileDTO{}
	}

	return FileDTO{
		Path: model.Path,
		Size: model.Size,
	}
}
