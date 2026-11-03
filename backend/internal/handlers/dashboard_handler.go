package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	BaseHandler
	Service *services.DashboardService
}

func NewDashboardHandler(s *services.DashboardService) *DashboardHandler {
	return &DashboardHandler{Service: s}
}

func (h *DashboardHandler) GetMetrics(c *gin.Context) {
	whID := parseUintPtr(c.Query("almacen_id"))
	metrics, err := h.Service.GetMetrics(whID)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, metrics)
}

