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

type AssetService struct {
	db *gorm.DB
}

func NewAssetService(db *gorm.DB) *AssetService {
	return &AssetService{db: db}
}

func (s *AssetService) ListAssets(almacenID, categoriaID, estadoID *uint, search string, page, limit int) ([]models.Asset, int64, error) {
	var activos []models.Asset
	var total int64
	q := s.db.Model(&models.Asset{}).Preload("Modelo.Marca").Preload("Modelo.Categoria").
		Preload("Almacen").Preload("Estado").Preload("Proveedor").Preload("UsuarioAsignado")

	if almacenID != nil && *almacenID > 0 { q = q.Where("activos.almacen_id = ?", *almacenID) }
	if estadoID != nil && *estadoID > 0 { q = q.Where("activos.estado_id = ?", *estadoID) }
	if categoriaID != nil && *categoriaID > 0 {
		q = q.Joins("JOIN modelos ON modelos.id = activos.modelo_id").Where("modelos.categoria_id = ?", *categoriaID)
	}
	if search != "" {
		sTerm := "%" + search + "%"
		q = q.Where("activos.codigo_activo ILIKE ? OR activos.numero_serie ILIKE ? OR activos.ubicacion_detalle ILIKE ?", sTerm, sTerm, sTerm)
	}
	q.Count(&total)
	offset := (page - 1) * limit
	err := q.Order("activos.created_at DESC").Offset(offset).Limit(limit).Find(&activos).Error
	return activos, total, err
}

func (s *AssetService) GetAssetByID(id uint) (*models.Asset, error) {
	var activo models.Asset
	err := s.db.Preload("Modelo.Marca").Preload("Modelo.Categoria").
		Preload("Almacen").Preload("Estado").Preload("Proveedor").
		Preload("UsuarioAsignado").Preload("Creador").First(&activo, id).Error
	return &activo, err
}

func (s *AssetService) CreateAsset(asset *models.Asset, userID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		var exists int64
		tx.Model(&models.Asset{}).Where("codigo_activo = ? OR numero_serie = ?", asset.CodigoActivo, asset.NumeroSerie).Count(&exists)
		if exists > 0 { return errors.New("el código o número de serie ya está registrado") }

		asset.CreatedBy = userID
		if err := tx.Create(asset).Error; err != nil { return err }

		mov := models.Movement{Tipo: "entrada", ActivoID: &asset.ID, Cantidad: 1, AlmacenDestinoID: &asset.AlmacenID, Motivo: "Alta inicial de activo", Documento: asset.CodigoActivo, Fecha: time.Now(), CreatedBy: userID}
		if err := tx.Create(&mov).Error; err != nil { return err }

		middleware.AuditLoggerHelper(tx, "activos", strconv.FormatUint(uint64(asset.ID), 10), "INSERT", nil, asset, userID)
		return nil
	})
}

func (s *AssetService) UpdateAsset(id uint, updates map[string]interface{}, userID *uuid.UUID) (*models.Asset, error) {
	var activo models.Asset
	if err := s.db.First(&activo, id).Error; err != nil { return nil, err }
	old := activo
	if err := s.db.Model(&activo).Updates(updates).Error; err != nil { return nil, err }
	middleware.AuditLoggerHelper(s.db, "activos", strconv.FormatUint(uint64(id), 10), "UPDATE", old, activo, userID)
	return s.GetAssetByID(id)
}

func (s *AssetService) DeleteAsset(id uint, userID *uuid.UUID) error {
	var activo models.Asset
	if err := s.db.First(&activo, id).Error; err != nil { return err }
	old := activo
	if err := s.db.Model(&activo).Update("activo", false).Error; err != nil { return err }
	middleware.AuditLoggerHelper(s.db, "activos", strconv.FormatUint(uint64(id), 10), "DELETE", old, nil, userID)
	return nil
}
