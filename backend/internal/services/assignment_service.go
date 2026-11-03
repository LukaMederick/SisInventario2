package services

import (
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AssignmentService struct {
	db *gorm.DB
}

func NewAssignmentService(db *gorm.DB) *AssignmentService {
	return &AssignmentService{db: db}
}

// ListAssignments lista asignaciones con filtros
func (s *AssignmentService) ListAssignments(activoID *uint, usuarioID *uuid.UUID, estado string, page, limit int) ([]models.Assignment, int64, error) {
	var list []models.Assignment
	var total int64

	query := s.db.Model(&models.Assignment{}).
		Preload("Activo.Modelo.Marca").
		Preload("Usuario").
		Preload("Almacen").
		Preload("Creador")

	if activoID != nil && *activoID > 0 {
		query = query.Where("activo_id = ?", *activoID)
	}
	if usuarioID != nil && *usuarioID != uuid.Nil {
		query = query.Where("asignado_a = ?", *usuarioID)
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

	err := query.Order("fecha_asignacion DESC").Offset(offset).Limit(limit).Find(&list).Error
	return list, total, err
}

