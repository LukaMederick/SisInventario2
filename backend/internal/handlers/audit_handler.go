package handlers

import (
	"net/http"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuditHandler struct {
	BaseHandler
	Service *services.AuditService
}

func NewAuditHandler(s *services.AuditService) *AuditHandler {
	return &AuditHandler{Service: s}
}

func (h *AuditHandler) List(c *gin.Context) {
	tabla := c.Query("tabla")
	accion := c.Query("accion")
	var uID *uuid.UUID
	if uStr := c.Query("usuario_id"); uStr != "" {
		if uid, err := uuid.Parse(uStr); err == nil {
			uID = &uid
		}
	}
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
	logs, total, err := h.Service.ListAuditLogs(tabla, accion, uID, desde, hasta, page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": logs, "total": total, "page": page, "limit": limit})
}

