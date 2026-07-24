package app

import (
	anatorrent "github.com/anacrolix/torrent"
	"github.com/bymoxb/metatorrent/internal/domain"
	"github.com/bymoxb/metatorrent/internal/infra/http/controllers"
	torrentinfra "github.com/bymoxb/metatorrent/internal/infra/torrent"
	"github.com/bymoxb/metatorrent/internal/service"
	"github.com/gin-gonic/gin"
)

type App struct {
	router          *gin.Engine
	anacrolixClient *anatorrent.Client
}

func NewApp() (*App, error) {

	var err error
	var anacrolixClient *anatorrent.Client

	anacrolixClient, err = torrentinfra.NewAnacrolixClient()

	if err != nil {
		return nil, err
	}

	router := gin.Default()

	routerGroup := router.Group("/api")

	var torrentClient domain.TorrentClient
	torrentClient = torrentinfra.New(anacrolixClient)
	metaService := service.NewTorrentService(torrentClient)
	metaController := controllers.NewMetaController(metaService)

	routerGroup.POST("/meta", metaController.MetadataHandler)

	return &App{
		router:          router,
		anacrolixClient: anacrolixClient,
	}, nil
}

func (s *App) Run() error {
	return s.router.Run()
}

func (s *App) Close() {
	s.anacrolixClient.Close()
}
