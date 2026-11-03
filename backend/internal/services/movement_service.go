package services

import (
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"gorm.io/gorm"
)

type MovementService struct {
	db *gorm.DB
}

func NewMovementService(db *gorm.DB) *MovementService {
	return &MovementService{db: db}
}

// ListMovements lista el historial con filtros de tipo, almacén, fecha y búsqueda
func (s *MovementService) ListMovements(tipo string, almacenID *uint, activoID *uint, itemID *uint, desde, hasta *time.Time, page, limit int) ([]models.Movement, int64, error) {
	var list []models.Movement
	var total int64

	query := s.db.Model(&models.Movement{}).
		Preload("Activo.Modelo").
		Preload("Item").
		Preload("AlmacenOrigen").
		Preload("AlmacenDestino").
		Preload("UsuarioDestino").
		Preload("Creador")

	if tipo != "" {
		query = query.Where("tipo = ?", tipo)
	}
	if activoID != nil && *activoID > 0 {
		query = query.Where("activo_id = ?", *activoID)
	}
	if itemID != nil && *itemID > 0 {
		query = query.Where("item_id = ?", *itemID)
	}
	if almacenID != nil && *almacenID > 0 {
		query = query.Where("almacen_origen_id = ? OR almacen_destino_id = ?", *almacenID, *almacenID)
	}
	if desde != nil {
		query = query.Where("fecha >= ?", *desde)
	}
	if hasta != nil {
		query = query.Where("fecha <= ?", *hasta)
	}

	query.Count(&total)

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 50
	}
	offset := (page - 1) * limit

	err := query.Order("fecha DESC").Offset(offset).Limit(limit).Find(&list).Error
	return list, total, err
}

