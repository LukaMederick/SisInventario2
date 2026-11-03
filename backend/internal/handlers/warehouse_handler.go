package handlers

import (
	"net/http"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type WarehouseHandler struct {
	BaseHandler
	Service *services.CatalogService
}

func NewWarehouseHandler(s *services.CatalogService) *WarehouseHandler {
	return &WarehouseHandler{Service: s}
}

func (h *WarehouseHandler) List(c *gin.Context) {
	list, err := h.Service.ListWarehouses()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *WarehouseHandler) Create(c *gin.Context) {
	var wh models.Warehouse
	if err := c.ShouldBindJSON(&wh); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateWarehouse(&wh, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, wh)
}

func (h *WarehouseHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.UpdateWarehouse(uint(id), updates, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Almacén actualizado"})
}

