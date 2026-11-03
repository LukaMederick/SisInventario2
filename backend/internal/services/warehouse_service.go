package services

import (
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
)

// ListWarehouses lista almacenes con su responsable
func (s *CatalogService) ListWarehouses() ([]models.Warehouse, error) {
	var list []models.Warehouse
	err := s.db.Preload("Responsable").Order("nombre ASC").Find(&list).Error
	return list, err
}

// CreateWarehouse registra un almacén
func (s *CatalogService) CreateWarehouse(wh *models.Warehouse, userID *uuid.UUID) error {
	if err := s.db.Create(wh).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "almacenes", strconv.FormatUint(uint64(wh.ID), 10), "INSERT", nil, wh, userID)
	return nil
}

// UpdateWarehouse actualiza almacén
func (s *CatalogService) UpdateWarehouse(id uint, updates map[string]interface{}, userID *uuid.UUID) error {
	var wh models.Warehouse
	if err := s.db.First(&wh, id).Error; err != nil {
		return err
	}
	old := wh
	if err := s.db.Model(&wh).Updates(updates).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "almacenes", strconv.FormatUint(uint64(id), 10), "UPDATE", old, wh, userID)
	return nil
}

