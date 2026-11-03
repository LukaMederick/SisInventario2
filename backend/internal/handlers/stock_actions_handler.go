package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AjustarStockReq struct {
	ItemID        uint   `json:"item_id" binding:"required"`
	AlmacenID     uint   `json:"almacen_id" binding:"required"`
	NuevaCantidad int    `json:"nueva_cantidad" binding:"gte=0"`
	Motivo        string `json:"motivo" binding:"required"`
}

func (h *StockHandler) AjustarStock(c *gin.Context) {
	var req AjustarStockReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.AjustarStock(req.ItemID, req.AlmacenID, req.NuevaCantidad, req.Motivo, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Stock ajustado exitosamente"})
}

type RegistrarEntradaReq struct {
	ItemID    uint   `json:"item_id" binding:"required"`
	AlmacenID uint   `json:"almacen_id" binding:"required"`
	Cantidad  int    `json:"cantidad" binding:"required,gt=0"`
	Documento string `json:"documento"`
	Motivo    string `json:"motivo"`
}

func (h *StockHandler) RegistrarEntrada(c *gin.Context) {
	var req RegistrarEntradaReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := h.Service.RegistrarEntradaInventario(req.ItemID, req.AlmacenID, req.Cantidad, req.Documento, req.Motivo, h.GetUserID(c)); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Entrada de inventario registrada con éxito"})
}

