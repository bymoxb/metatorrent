package controllers

import (
	"net/http"

	"github.com/bymoxb/metatorrent/internal/infra/http/dtos"
	"github.com/bymoxb/metatorrent/internal/service"
	"github.com/gin-gonic/gin"
)

type MetaController struct {
	service *service.TorrentService
}

type MetaRequest struct {
	Url string `json:"url"`
}

func NewMetaController(service *service.TorrentService) *MetaController {
	return &MetaController{
		service: service,
	}
}

func (self *MetaController) MetadataHandler(c *gin.Context) {

	var request MetaRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	result, err := self.service.ExtractMetadata(request.Url)

	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "invalid process url"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": dtos.MapMetadataToDTO(result),
	})
}
