package services

import (
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuditService struct {
	db *gorm.DB
}

func NewAuditService(db *gorm.DB) *AuditService {
	return &AuditService{db: db}
}

func (s *AuditService) ListAuditLogs(tabla, accion string, usuarioID *uuid.UUID, desde, hasta *time.Time, page, limit int) ([]models.Audit, int64, error) {
	var logs []models.Audit
	var total int64

	query := s.db.Model(&models.Audit{}).Preload("Usuario")

	if tabla != "" {
		query = query.Where("tabla = ?", tabla)
	}
	if accion != "" {
		query = query.Where("accion = ?", accion)
	}
	if usuarioID != nil && *usuarioID != uuid.Nil {
		query = query.Where("usuario_id = ?", *usuarioID)
	}
	if desde != nil {
		query = query.Where("created_at >= ?", *desde)
	}
	if hasta != nil {
		query = query.Where("created_at <= ?", *hasta)
	}

	query.Count(&total)

	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 50
	}
	offset := (page - 1) * limit

	err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&logs).Error
	return logs, total, err
}

