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

// AsignarEquipo TRANSACCIÓN ACID
func (s *AssetService) AsignarEquipo(activoID uint, usuarioID uuid.UUID, almacenID *uint, notas string, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var activo models.Asset
		if err := tx.First(&activo, activoID).Error; err != nil {
			return errors.New("activo no encontrado")
		}

		var st models.EquipmentState
		if err := tx.Where("nombre = ?", "Asignado").First(&st).Error; err != nil {
			return errors.New("estado 'Asignado' no configurado")
		}

		now := time.Now()
		tx.Model(&models.Assignment{}).Where("activo_id = ? AND estado = 'activa'", activoID).
			Updates(map[string]interface{}{"fecha_devolucion": now, "estado": "devuelta"})

		old := activo
		if err := tx.Model(&activo).Updates(map[string]interface{}{"estado_id": st.ID, "asignado_a": usuarioID, "updated_at": now}).Error; err != nil {
			return err
		}

		whID := activo.AlmacenID
		if almacenID != nil && *almacenID > 0 {
			whID = *almacenID
		}

		asig := models.Assignment{
			ActivoID: activoID, AsignadoA: usuarioID, AlmacenID: whID,
			FechaAsignacion: now, Estado: "activa", Notas: notas, CreatedBy: userID,
		}
		if err := tx.Create(&asig).Error; err != nil {
			return err
		}

		mov := models.Movement{
			Tipo: "asignacion", ActivoID: &activoID, Cantidad: 1, AlmacenOrigenID: &whID,
			UsuarioDestinoID: &usuarioID, Motivo: notas, Fecha: now, CreatedBy: userID,
		}
		_ = tx.Create(&mov)

		middleware.AuditLoggerHelper(tx, "activos", strconv.FormatUint(uint64(activoID), 10), "UPDATE", old, activo, userID)
		return nil
	})
}

// DevolverEquipo TRANSACCIÓN ACID
func (s *AssetService) DevolverEquipo(activoID uint, estadoID, almacenID *uint, notas string, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var activo models.Asset
		if err := tx.First(&activo, activoID).Error; err != nil {
			return errors.New("activo no encontrado")
		}

		targetEstado := uint(1)
		if estadoID != nil && *estadoID > 0 {
			targetEstado = *estadoID
		}

		now := time.Now()
		prevUser := activo.AsignadoA

		tx.Model(&models.Assignment{}).Where("activo_id = ? AND estado = 'activa'", activoID).
			Updates(map[string]interface{}{"fecha_devolucion": now, "estado": "devuelta"})

		old := activo
		updates := map[string]interface{}{"estado_id": targetEstado, "asignado_a": nil, "updated_at": now}
		if almacenID != nil && *almacenID > 0 {
			updates["almacen_id"] = *almacenID
		}
		if err := tx.Model(&activo).Updates(updates).Error; err != nil {
			return err
		}

		whID := activo.AlmacenID
		if almacenID != nil && *almacenID > 0 {
			whID = *almacenID
		}

		mov := models.Movement{
			Tipo: "devolucion", ActivoID: &activoID, Cantidad: 1, AlmacenDestinoID: &whID,
			UsuarioDestinoID: prevUser, Motivo: notas, Fecha: now, CreatedBy: userID,
		}
		_ = tx.Create(&mov)

		middleware.AuditLoggerHelper(tx, "activos", strconv.FormatUint(uint64(activoID), 10), "UPDATE", old, activo, userID)
		return nil
	})
}

