package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type MaintenanceHandler struct {
	BaseHandler
	Service *services.MaintenanceService
}

func NewMaintenanceHandler(s *services.MaintenanceService) *MaintenanceHandler {
	return &MaintenanceHandler{Service: s}
}

func (h *MaintenanceHandler) List(c *gin.Context) {
	actID := parseUintPtr(c.Query("activo_id"))
	estado := c.Query("estado")
	page, limit := h.ParsePagination(c)

	maints, total, err := h.Service.ListMaintenances(actID, estado, page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": maints, "total": total, "page": page, "limit": limit})
}

func (h *MaintenanceHandler) Create(c *gin.Context) {
	var m models.Maintenance
	if err := c.ShouldBindJSON(&m); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateMaintenance(&m, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, m)
}

type UpdateMaintenanceStatusReq struct {
	Estado   string     `json:"estado" binding:"required"`
	FechaFin *time.Time `json:"fecha_fin"`
	Costo    *float64   `json:"costo"`
}

func (h *MaintenanceHandler) UpdateStatus(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req UpdateMaintenanceStatusReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	updated, err := h.Service.UpdateMaintenanceStatus(uint(id), req.Estado, req.FechaFin, req.Costo, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, updated)
}

