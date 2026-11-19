package services

import (
	"errors"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
)

func (s *CatalogService) CreateEquipmentState(st *models.EquipmentState, userID *uuid.UUID) error {
	var count int64
	s.db.Model(&models.EquipmentState{}).Where("nombre = ?", st.Nombre).Count(&count)
	if count > 0 {
		return errors.New("ya existe un estado con ese nombre")
	}
	if err := s.db.Create(st).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "estados_equipo", strconv.FormatUint(uint64(st.ID), 10), "INSERT", nil, st, userID)
	return nil
}

func (s *CatalogService) UpdateEquipmentState(id uint, updates map[string]interface{}, userID *uuid.UUID) (*models.EquipmentState, error) {
	var st models.EquipmentState
	if err := s.db.First(&st, id).Error; err != nil {
		return nil, errors.New("estado no encontrado")
	}
	old := st
	if err := s.db.Model(&st).Updates(updates).Error; err != nil {
		return nil, err
	}
	middleware.AuditLoggerHelper(s.db, "estados_equipo", strconv.FormatUint(uint64(id), 10), "UPDATE", old, st, userID)
	return &st, nil
}

func (s *CatalogService) DeleteEquipmentState(id uint, userID *uuid.UUID) error {
	var inUse int64
	s.db.Model(&models.Asset{}).Where("estado_id = ?", id).Count(&inUse)
	if inUse > 0 {
		return errors.New("no se puede eliminar: hay activos vinculados a este estado")
	}
	var st models.EquipmentState
	if err := s.db.First(&st, id).Error; err != nil {
		return errors.New("estado no encontrado")
	}
	old := st
	if err := s.db.Delete(&st).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "estados_equipo", strconv.FormatUint(uint64(id), 10), "DELETE", old, nil, userID)
	return nil
}

