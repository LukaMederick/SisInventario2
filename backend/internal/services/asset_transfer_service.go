package services

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// TransferirActivo TRANSACCIÓN ACID
func (s *AssetService) TransferirActivo(activoID uint, origenID *uint, destinoID uint, motivo string, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var activo models.Asset
		if err := tx.First(&activo, activoID).Error; err != nil {
			return errors.New("activo no encontrado")
		}
		currWh := activo.AlmacenID
		if origenID != nil && *origenID != currWh {
			return fmt.Errorf("origen no coincide con almacén actual")
		}
		if currWh == destinoID {
			return errors.New("destino debe ser diferente al almacén actual")
		}

		old := activo
		if err := tx.Model(&activo).Updates(map[string]interface{}{"almacen_id": destinoID, "updated_at": time.Now()}).Error; err != nil {
			return err
		}

		mov := models.Movement{
			Tipo: "transferencia", ActivoID: &activoID, Cantidad: 1,
			AlmacenOrigenID: &currWh, AlmacenDestinoID: &destinoID, Motivo: motivo,
			Fecha: time.Now(), CreatedBy: userID,
		}
		if err := tx.Create(&mov).Error; err != nil {
			return err
		}

		middleware.AuditLoggerHelper(tx, "activos", strconv.FormatUint(uint64(activoID), 10), "UPDATE", old, activo, userID)
		return nil
	})
}

