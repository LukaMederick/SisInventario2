package handlers

import (
	"net/http"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type StockHandler struct {
	BaseHandler
	Service *services.StockService
}

func NewStockHandler(s *services.StockService) *StockHandler {
	return &StockHandler{Service: s}
}

func (h *StockHandler) ListItems(c *gin.Context) {
	catID := parseUintPtr(c.Query("categoria_id"))
	search := c.Query("search")
	page, limit := h.ParsePagination(c)

	items, total, err := h.Service.ListItems(catID, search, page, limit)
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"data": items, "total": total, "page": page, "limit": limit})
}

func (h *StockHandler) GetItemByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	item, err := h.Service.GetItemByID(uint(id))
	if err != nil {
		h.JSONError(c, http.StatusNotFound, "Item no encontrado")
		return
	}
	h.JSONSuccess(c, item)
}

func (h *StockHandler) CreateItem(c *gin.Context) {
	var item models.Item
	if err := c.ShouldBindJSON(&item); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.CreateItem(&item, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *StockHandler) UpdateItem(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	updated, err := h.Service.UpdateItem(uint(id), updates, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, updated)
}

func (h *StockHandler) GetStockByWarehouse(c *gin.Context) {
	whID := parseUintPtr(c.Query("almacen_id"))
	stocks, err := h.Service.GetStockByWarehouse(whID, c.Query("search"))
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, stocks)
}

func (h *StockHandler) GetCriticalStock(c *gin.Context) {
	crit, err := h.Service.ListCriticalStock()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, crit)
}
