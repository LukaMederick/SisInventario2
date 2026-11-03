package services

import (
	"errors"
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StockService struct {
	db *gorm.DB
}

func NewStockService(db *gorm.DB) *StockService {
	return &StockService{db: db}
}

func (s *StockService) ListItems(categoriaID *uint, search string, page, limit int) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	q := s.db.Model(&models.Item{}).Preload("Categoria").Preload("Marca").
		Preload("Stocks.Almacen").Where("items.activo = true")

	if categoriaID != nil && *categoriaID > 0 {
		q = q.Where("items.categoria_id = ?", *categoriaID)
	}
	if search != "" {
		sTerm := "%" + search + "%"
		q = q.Where("items.sku ILIKE ? OR items.nombre ILIKE ? OR items.descripcion ILIKE ?", sTerm, sTerm, sTerm)
	}

	q.Count(&total)
	offset := (page - 1) * limit
	err := q.Order("items.nombre ASC").Offset(offset).Limit(limit).Find(&items).Error
	return items, total, err
}

func (s *StockService) GetItemByID(id uint) (*models.Item, error) {
	var item models.Item
	err := s.db.Preload("Categoria").Preload("Marca").Preload("Stocks.Almacen").First(&item, id).Error
	return &item, err
}

func (s *StockService) CreateItem(item *models.Item, userID *uuid.UUID) error {
	var count int64
	s.db.Model(&models.Item{}).Where("sku = ?", item.SKU).Count(&count)
	if count > 0 {
		return errors.New("el SKU ya se encuentra registrado")
	}

	if err := s.db.Create(item).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "items", strconv.FormatUint(uint64(item.ID), 10), "INSERT", nil, item, userID)
	return nil
}

func (s *StockService) UpdateItem(id uint, updates map[string]interface{}, userID *uuid.UUID) (*models.Item, error) {
	var item models.Item
	if err := s.db.First(&item, id).Error; err != nil {
		return nil, err
	}
	old := item
	if err := s.db.Model(&item).Updates(updates).Error; err != nil {
		return nil, err
	}
	middleware.AuditLoggerHelper(s.db, "items", strconv.FormatUint(uint64(id), 10), "UPDATE", old, item, userID)
	return s.GetItemByID(id)
}

func (s *StockService) GetStockByWarehouse(almacenID *uint, search string) ([]models.Stock, error) {
	var stocks []models.Stock
	q := s.db.Model(&models.Stock{}).Preload("Item.Categoria").Preload("Item.Marca").Preload("Almacen")

	if almacenID != nil && *almacenID > 0 {
		q = q.Where("almacen_id = ?", *almacenID)
	}
	if search != "" {
		sTerm := "%" + search + "%"
		q = q.Joins("JOIN items ON items.id = stock.item_id").Where("items.sku ILIKE ? OR items.nombre ILIKE ?", sTerm, sTerm)
	}

	err := q.Order("stock.cantidad ASC").Find(&stocks).Error
	return stocks, err
}
