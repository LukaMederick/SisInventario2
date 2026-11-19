package services

import (
	"errors"
	"strconv"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CreateMovementInput struct {
	Tipo             string     `json:"tipo" binding:"required"`
	AplicaA          string     `json:"aplica_a" binding:"required"`
	ActivoID         *uint      `json:"activo_id"`
	ItemID           *uint      `json:"item_id"`
	Cantidad         int        `json:"cantidad" binding:"required"`
	AlmacenOrigenID  *uint      `json:"almacen_origen_id"`
	AlmacenDestinoID *uint      `json:"almacen_destino_id"`
	Documento        string     `json:"documento"`
	Motivo           string     `json:"motivo" binding:"required"`
}

func (s *MovementService) CreateManualMovement(in *CreateMovementInput, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		if in.Cantidad <= 0 { in.Cantidad = 1 }

		if in.AplicaA == "activo" && in.ActivoID != nil {
			var act models.Asset
			if err := tx.First(&act, *in.ActivoID).Error; err != nil { return errors.New("activo no encontrado") }
			oldAct := act
			if in.Tipo == "transferencia" && in.AlmacenDestinoID != nil {
				tx.Model(&act).Update("almacen_id", *in.AlmacenDestinoID)
			} else if in.Tipo == "baja" {
				var baja models.EquipmentState
				if err := tx.Where("nombre = ?", "Baja").First(&baja).Error; err == nil {
					tx.Model(&act).Update("estado_id", baja.ID)
				}
			}
			middleware.AuditLoggerHelper(tx, "activos", strconv.FormatUint(uint64(act.ID), 10), "UPDATE", oldAct, act, userID)
		} else if in.AplicaA == "item" && in.ItemID != nil {
			whID := in.AlmacenDestinoID
			if whID == nil || in.Tipo == "salida" || in.Tipo == "ajuste" { whID = in.AlmacenOrigenID }
			if whID != nil {
				var stk models.Stock
				err := tx.Where("item_id = ? AND almacen_id = ?", *in.ItemID, *whID).First(&stk).Error
				if errors.Is(err, gorm.ErrRecordNotFound) {
					stk = models.Stock{ItemID: *in.ItemID, AlmacenID: *whID, Cantidad: in.Cantidad, UltimoConteo: &now}
					_ = tx.Create(&stk)
				} else if err == nil {
					if in.Tipo == "entrada" { stk.Cantidad += in.Cantidad }
					if in.Tipo == "salida" { stk.Cantidad -= in.Cantidad; if stk.Cantidad < 0 { stk.Cantidad = 0 } }
					if in.Tipo == "ajuste" { stk.Cantidad = in.Cantidad }
					stk.UltimoConteo = &now
					_ = tx.Save(&stk)
				}
			}
		}

		mov := models.Movement{
			Tipo: in.Tipo, ActivoID: in.ActivoID, ItemID: in.ItemID, Cantidad: in.Cantidad,
			AlmacenOrigenID: in.AlmacenOrigenID, AlmacenDestinoID: in.AlmacenDestinoID,
			Motivo: in.Motivo, Documento: in.Documento, Fecha: now, CreatedBy: userID,
		}
		if err := tx.Create(&mov).Error; err != nil { return err }
		middleware.AuditLoggerHelper(tx, "movimientos", strconv.FormatUint(uint64(mov.ID), 10), "INSERT", nil, mov, userID)
		return nil
	})
}

