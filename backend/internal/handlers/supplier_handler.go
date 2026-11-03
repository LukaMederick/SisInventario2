package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/gin-gonic/gin"
)

func (h *CatalogHandler) ListEquipmentStates(c *gin.Context) {
	list, err := h.Service.ListEquipmentStates()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *CatalogHandler) ListSuppliers(c *gin.Context) {
	list, err := h.Service.ListSuppliers()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *CatalogHandler) CreateSupplier(c *gin.Context) {
	var sup models.Supplier
	if err := c.ShouldBindJSON(&sup); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateSupplier(&sup, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, sup)
}

