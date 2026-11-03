package handlers

import (
	"net/http"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type AssetHandler struct {
	BaseHandler
	Service *services.AssetService
}

func NewAssetHandler(s *services.AssetService) *AssetHandler {
	return &AssetHandler{Service: s}
}

func (h *AssetHandler) List(c *gin.Context) {
	almacenID := parseUintPtr(c.Query("almacen_id"))
	catID := parseUintPtr(c.Query("categoria_id"))
	estadoID := parseUintPtr(c.Query("estado_id"))
	page, limit := h.ParsePagination(c)

	activos, total, err := h.Service.ListAssets(almacenID, catID, estadoID, c.Query("search"), page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": activos, "total": total, "page": page, "limit": limit})
}

func (h *AssetHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, "ID inválido")
		return
	}

	activo, err := h.Service.GetAssetByID(uint(id))
	if err != nil {
		h.JSONError(c, http.StatusNotFound, "Activo no encontrado")
		return
	}
	h.JSONSuccess(c, activo)
}

func (h *AssetHandler) Create(c *gin.Context) {
	var asset models.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.Service.CreateAsset(&asset, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, asset)
}

func (h *AssetHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	updated, err := h.Service.UpdateAsset(uint(id), updates, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, updated)
}

func (h *AssetHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.Service.DeleteAsset(uint(id), h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Activo dado de baja"})
}

func parseUintPtr(s string) *uint {
	if s == "" {
		return nil
	}
	if v, err := strconv.ParseUint(s, 10, 32); err == nil {
		u := uint(v)
		return &u
	}
	return nil
}
