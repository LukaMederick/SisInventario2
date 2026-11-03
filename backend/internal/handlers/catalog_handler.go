package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type CatalogHandler struct {
	BaseHandler
	Service *services.CatalogService
}

func NewCatalogHandler(s *services.CatalogService) *CatalogHandler {
	return &CatalogHandler{Service: s}
}

// Categorías
func (h *CatalogHandler) ListCategories(c *gin.Context) {
	list, err := h.Service.ListCategories()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *CatalogHandler) CreateCategory(c *gin.Context) {
	var cat models.Category
	if err := c.ShouldBindJSON(&cat); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateCategory(&cat, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, cat)
}

// Marcas
func (h *CatalogHandler) ListBrands(c *gin.Context) {
	list, err := h.Service.ListBrands()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *CatalogHandler) CreateBrand(c *gin.Context) {
	var brand models.Brand
	if err := c.ShouldBindJSON(&brand); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateBrand(&brand, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, brand)
}

// Modelos
func (h *CatalogHandler) ListModels(c *gin.Context) {
	catID := parseUintPtr(c.Query("categoria_id"))
	marcaID := parseUintPtr(c.Query("marca_id"))
	list, err := h.Service.ListModels(catID, marcaID)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, list)
}

func (h *CatalogHandler) CreateModel(c *gin.Context) {
	var model models.Model
	if err := c.ShouldBindJSON(&model); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateModel(&model, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, model)
}
