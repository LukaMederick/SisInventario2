package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TransferReq struct {
	AlmacenDestinoID uint   `json:"almacen_destino_id" binding:"required"`
	AlmacenOrigenID  *uint  `json:"almacen_origen_id"`
	Motivo           string `json:"motivo" binding:"required"`
}

func (h *AssetHandler) Transferir(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req TransferReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, 400, err.Error())
		return
	}

	err := h.Service.TransferirActivo(uint(id), req.AlmacenOrigenID, req.AlmacenDestinoID, req.Motivo, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, 400, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Transferencia exitosa"})
}

type AssignReq struct {
	UsuarioDestinoID uuid.UUID `json:"usuario_destino_id" binding:"required"`
	AlmacenID        *uint     `json:"almacen_id"`
	Notas            string    `json:"notas"`
}

func (h *AssetHandler) Asignar(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req AssignReq
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, 400, err.Error())
		return
	}

	err := h.Service.AsignarEquipo(uint(id), req.UsuarioDestinoID, req.AlmacenID, req.Notas, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, 400, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Asignación exitosa"})
}

type DevolverReq struct {
	EstadoEquipoID *uint  `json:"estado_equipo_id"`
	AlmacenID      *uint  `json:"almacen_id"`
	Notas          string `json:"notas"`
}

func (h *AssetHandler) Devolver(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	var req DevolverReq
	_ = c.ShouldBindJSON(&req)

	err := h.Service.DevolverEquipo(uint(id), req.EstadoEquipoID, req.AlmacenID, req.Notas, h.GetUserID(c))
	if err != nil {
		h.JSONError(c, 400, err.Error())
		return
	}
	h.JSONSuccess(c, gin.H{"message": "Devolución exitosa"})
}

