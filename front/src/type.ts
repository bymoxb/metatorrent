
export interface Torrent {
    name: string
    size: number
    files: File[]
    peers: number
    seeds: number
    trackers: string[]
    magnet: string
}

export interface File {
    path: string
    size: number
}

