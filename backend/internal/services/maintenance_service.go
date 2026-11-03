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

type MaintenanceService struct {
	db *gorm.DB
}

func NewMaintenanceService(db *gorm.DB) *MaintenanceService {
	return &MaintenanceService{db: db}
}

// ListMaintenances lista mantenimientos con filtros
func (s *MaintenanceService) ListMaintenances(activoID *uint, estado string, page, limit int) ([]models.Maintenance, int64, error) {
	var list []models.Maintenance
	var total int64

	query := s.db.Model(&models.Maintenance{}).
		Preload("Activo.Modelo.Marca").
		Preload("Activo.Almacen").
		Preload("Proveedor").
		Preload("Creador")

	if activoID != nil && *activoID > 0 {
		query = query.Where("activo_id = ?", *activoID)
	}
	if estado != "" {
		query = query.Where("estado = ?", estado)
	}

	query.Count(&total)

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 50
	}
	offset := (page - 1) * limit

	err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&list).Error
	return list, total, err
}

// CreateMaintenance crea un mantenimiento y opcionalmente cambia el estado del activo a 'Mantenimiento'
func (s *MaintenanceService) CreateMaintenance(m *models.Maintenance, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var activo models.Asset
		if err := tx.First(&activo, m.ActivoID).Error; err != nil {
			return errors.New("activo no encontrado")
		}

		m.CreatedBy = userID
		if m.FechaInicio.IsZero() {
			m.FechaInicio = time.Now()
		}
		if m.Estado == "" {
			m.Estado = "pendiente"
		}

		if err := tx.Create(m).Error; err != nil {
			return err
		}

		// Actualizar estado del activo a 'Mantenimiento'
		var estadoMaint models.EquipmentState
		if err := tx.Where("nombre = ?", "Mantenimiento").First(&estadoMaint).Error; err == nil {
			tx.Model(&activo).Updates(map[string]interface{}{
				"estado_id":  estadoMaint.ID,
				"updated_at": time.Now(),
			})
		}

		middleware.AuditLoggerHelper(tx, "mantenimientos", strconv.FormatUint(uint64(m.ID), 10), "INSERT", nil, m, userID)
		return nil
	})
}
