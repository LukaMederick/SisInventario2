package handlers

import (
	"net/http"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type MovementHandler struct {
	BaseHandler
	Service *services.MovementService
}

func NewMovementHandler(s *services.MovementService) *MovementHandler {
	return &MovementHandler{Service: s}
}

func (h *MovementHandler) List(c *gin.Context) {
	tipo := c.Query("tipo")
	whID := parseUintPtr(c.Query("almacen_id"))
	actID := parseUintPtr(c.Query("activo_id"))
	itmID := parseUintPtr(c.Query("item_id"))

	var desde, hasta *time.Time
	if dStr := c.Query("desde"); dStr != "" {
		if t, err := time.Parse("2006-01-02", dStr); err == nil {
			desde = &t
		}
	}
	if hStr := c.Query("hasta"); hStr != "" {
		if t, err := time.Parse("2006-01-02", hStr); err == nil {
			t = t.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
			hasta = &t
		}
	}

	page, limit := h.ParsePagination(c)
	movs, total, err := h.Service.ListMovements(tipo, whID, actID, itmID, desde, hasta, page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": movs, "total": total, "page": page, "limit": limit})
}

