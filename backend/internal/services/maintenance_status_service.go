package services

import (
	"strconv"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UpdateMaintenanceStatus actualiza estado del ticket de mantenimiento (y retorna el equipo a 'Disponible' si se completa)
func (s *MaintenanceService) UpdateMaintenanceStatus(id uint, nuevoEstado string, fechaFin *time.Time, costo *float64, userID *uuid.UUID) (*models.Maintenance, error) {
	var m models.Maintenance
	if err := s.db.First(&m, id).Error; err != nil {
		return nil, err
	}

	updates := map[string]interface{}{
		"estado":     nuevoEstado,
		"updated_at": time.Now(),
	}
	if fechaFin != nil {
		updates["fecha_fin"] = fechaFin
	} else if nuevoEstado == "completado" {
		now := time.Now()
		updates["fecha_fin"] = &now
	}
	if costo != nil {
		updates["costo"] = *costo
	}

	err := s.db.Transaction(func(tx *gorm.DB) error {
		oldData := m
		if err := tx.Model(&m).Updates(updates).Error; err != nil {
			return err
		}

		// Si se completa o cancela, devolver el estado del activo a 'Disponible'
		if nuevoEstado == "completado" || nuevoEstado == "cancelado" {
			var estadoDisp models.EquipmentState
			if err := tx.Where("nombre = ?", "Disponible").First(&estadoDisp).Error; err == nil {
				tx.Model(&models.Asset{}).Where("id = ?", m.ActivoID).Updates(map[string]interface{}{
					"estado_id":  estadoDisp.ID,
					"updated_at": time.Now(),
				})
			}
		}

		middleware.AuditLoggerHelper(tx, "mantenimientos", strconv.FormatUint(uint64(id), 10), "UPDATE", oldData, m, userID)
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &m, nil
}

