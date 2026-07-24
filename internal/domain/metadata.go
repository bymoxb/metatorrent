package domain

type Metadata struct {
	Name     string
	Size     int64
	Files    []File
	Peers    int
	Seeds    int
	Trackers []string
	Magnet   string
}

type File struct {
	Path string
	Size int64
}
