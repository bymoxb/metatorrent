# MetaTorrent — Torrent & Magnet Metadata Inspector

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Language](https://img.shields.io/badge/Language-Go%20|%20TypeScript-blue.svg)

## Overview

**MetaTorrent** is a dark-mode web app for inspecting magnet links and torrent files before downloading. Enter a magnet URI or `.torrent` URL to reveal torrent metadata, file contents, total size, trackers, and health stats.

The project combines a Go backend with a Preact frontend to deliver fast metadata extraction and an intuitive inspection experience.

🚀 **Try the live application:** https://metatorrent.illapa.dev/

## Key Features

- 🔍 **Magnet and Torrent Support** - Analyze `magnet:?` links and remote `.torrent` files.
- 📦 **File Preview** - Browse torrent file paths and sizes without downloading content.
- 📈 **Health Metrics** - See connected seeds and peers from the torrent session.
- 🌐 **Tracker List** - Inspect tracker endpoints and tracker types.
- 📋 **Magnet Copy + Open Client** - Copy the magnet URI or open it in an external torrent client.
- ⚡ **Fast UI** - Built with Preact, Vite, and Tailwind CSS.
- 🐳 **Docker-ready** - Multi-stage build with a small distroless runtime.

## Quick Start

### Docker Deployment

Run the container

```bash
docker run -d \
  --name metatorrent \
  --restart unless-stopped \
  -p 8080:8080 \
  ghcr.io/bymoxb/metatorrent:latest
```

Access the application at `http://localhost:8080`

### Docker Compose

Create a `docker-compose.yml` file in the project root with the following content:

```yaml
services:
  metatorrent:
    image: ghcr.io/bymoxb/metatorrent:latest
    container_name: metatorrent
    restart: unless-stopped
    ports:
      - 8080:8080
```

Steps to use `docker compose`:

```bash
# Start the service in detached mode
docker compose up -d

# View logs
docker compose logs -f metatorrent

# Stop and remove
docker compose down
```

## Technology Stack

### Backend
- **Language**: Go
- **Framework**: Gin
- **Torrent Library**: `anacrolix/torrent`
- **Static Files**: Embedded frontend build via Go `embed`

### Frontend
- **Framework**: Preact
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

### DevOps
- **Containerization**: Docker
- **Runtime**: distroless Linux image

## Project Structure

```
metatorrent/
├── cmd/                          # Optional command applications
├── config/                       # Local runtime configuration and data volume mount
├── front/                        # Preact + Vite frontend application
│   ├── public/                   # Static HTML and favicon assets
│   ├── src/                      # UI components, hooks, types, and utils
│   ├── package.json
│   └── tsconfig.json
├── internal/                     # Backend implementation
│   ├── domain/                   # Domain models and interfaces
│   ├── infra/                    # Config, HTTP controllers, static assets, torrent client
│   └── service/                  # Business logic service layer
├── docker-compose.yaml          # Local compose deployment
├── dockerfile                   # Multi-stage Docker build
├── go.mod                       # Go module dependencies
├── main.go                      # App entrypoint
└── README.md                    # Project documentation
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENV` | No | `development` | Set to `production` to enable trusted proxy and platform handling. |
| `TRUSTED_PROXIES` | No | `127.0.0.1` | Comma-separated list of trusted reverse proxy IPs. |
| `TRUSTED_PLATFORM` | No | *(empty)* | Optional trusted platform identifier (`cloudflare`). |

## Features in Detail

### Torrent & Magnet Metadata Inspection
- Paste a magnet link or a remote `.torrent` URL.
- Extract torrent metadata without downloading content.
- Preview file list and individual file sizes.
- Display connected seed and peer counts.
- List tracker URLs and copy the resolved magnet URI.

### User Experience
- Dark-mode-first interface.
- Responsive layout for mobile and desktop.
- Clear loading, empty, and error states.
- Fast client-server interaction via `/api/meta`.

## API Endpoint

- `POST /api/meta`
  - Request body: `{ "url": "magnet:?xt=urn:btih:..." }`
  - Response body: `{ "data": { name, size, files, peers, seeds, trackers, magnet } }`

## Development

### Prerequisites

- Go 1.26 or higher
- Node.js 24 or higher
- PNPM 11 or higher
- Docker (optional)

### Clone the Repository

```bash
git clone https://github.com/bymoxb/metatorrent.git
cd metatorrent
```

### Backend Setup

```bash
go mod download
go run cmd/server/main.go
```

### Frontend Setup

```bash
cd front
pnpm install
pnpm dev
```

### Docker Build & Run

```bash
docker compose up --build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## SEO Metadata

- **Title**: MetaTorrent — Torrent & Magnet Metadata Inspector
- **Description**: MetaTorrent is a lightweight, dark-mode web tool to instantly inspect magnet links and torrent hashes. View file lists, size, trackers, and real-time health (seeds/peers) without downloading the content.
- **Keywords**: MetaTorrent, torrent inspector, magnet link analyzer, torrent metadata, torrent file list, seeds and peers checker, bittorrent, trackers list, magnet hash, React, Tailwind CSS
- **Author**: bymoxb
- **Canonical**: https://metatorrent.illapa.dev/
