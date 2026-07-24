package app

import (
	"fmt"

	anatorrent "github.com/anacrolix/torrent"
	"github.com/bymoxb/metatorrent/internal/domain"
	"github.com/bymoxb/metatorrent/internal/infra/config"
	"github.com/bymoxb/metatorrent/internal/infra/http/controllers"
	"github.com/bymoxb/metatorrent/internal/infra/http/static"
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
	var cfg *config.Config

	if cfg, err = config.LoadEnv(); err != nil {
		return nil, err
	}

	anacrolixClient, err = torrentinfra.NewAnacrolixClient(cfg)

	if err != nil {
		return nil, err
	}

	router := gin.Default()

	setupApiRoutes(router, anacrolixClient)

	if err = static.SetupStaticRoutes(router); err != nil {
		return nil, err
	}

	if err = setupOrigins(cfg, router); err != nil {
		return nil, err
	}

	return &App{
		router:          router,
		anacrolixClient: anacrolixClient,
	}, nil
}

func setupApiRoutes(router *gin.Engine, anacrolixClient *anatorrent.Client) *gin.RouterGroup {
	routerGroup := router.Group("/api")

	var torrentClient domain.TorrentClient
	torrentClient = torrentinfra.New(anacrolixClient)
	metaService := service.NewTorrentService(torrentClient)
	metaController := controllers.NewMetaController(metaService)

	routerGroup.POST("/meta", metaController.MetadataHandler)

	return routerGroup
}

func setupOrigins(cfg *config.Config, router *gin.Engine) error {

	if !cfg.IsProd {
		return nil
	}

	if cfg.TrustedPlatform != "" {
		switch cfg.TrustedPlatform {
		case "cloudflare":
			router.TrustedPlatform = gin.PlatformCloudflare
		default:
			return fmt.Errorf("Unsupported trusted platform: %s", cfg.TrustedPlatform)
		}
	}

	if err := router.SetTrustedProxies(cfg.TrustedProxies); err != nil {
		return fmt.Errorf("Error setting trusted proxies: %w", err)
	}

	return nil
}

func (s *App) Run() error {
	return s.router.Run()
}

func (s *App) Close() {
	s.anacrolixClient.Close()
}
