package handlers

import (
	"net/http"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/gin-gonic/gin"
)

func (h *CatalogHandler) CreateEquipmentState(c *gin.Context) {
	var st models.EquipmentState
	if err := c.ShouldBindJSON(&st); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateEquipmentState(&st, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, st)
}

func (h *CatalogHandler) UpdateEquipmentState(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, "ID inválido")
		return
	}
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	st, err := h.Service.UpdateEquipmentState(uint(id), updates, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, st)
}

func (h *CatalogHandler) DeleteEquipmentState(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, "ID inválido")
		return
	}
	if err := h.Service.DeleteEquipmentState(uint(id), h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Estado eliminado correctamente"})
}

