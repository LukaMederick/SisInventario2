package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AssignmentHandler struct {
	BaseHandler
	Service *services.AssignmentService
}

func NewAssignmentHandler(s *services.AssignmentService) *AssignmentHandler {
	return &AssignmentHandler{Service: s}
}

func (h *AssignmentHandler) List(c *gin.Context) {
	actID := parseUintPtr(c.Query("activo_id"))
	var uID *uuid.UUID
	if uStr := c.Query("usuario_id"); uStr != "" {
		if uid, err := uuid.Parse(uStr); err == nil {
			uID = &uid
		}
	}
	estado := c.Query("estado")
	page, limit := h.ParsePagination(c)

	asigs, total, err := h.Service.ListAssignments(actID, uID, estado, page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": asigs, "total": total, "page": page, "limit": limit})
}

