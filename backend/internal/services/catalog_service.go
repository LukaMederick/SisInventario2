package services

import (
	"strconv"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CatalogService struct {
	db *gorm.DB
}

func NewCatalogService(db *gorm.DB) *CatalogService {
	return &CatalogService{db: db}
}

// Categorías
func (s *CatalogService) ListCategories() ([]models.Category, error) {
	var list []models.Category
	err := s.db.Preload("CategoriaPadre").Preload("Subcategorias").Order("nombre ASC").Find(&list).Error
	return list, err
}

func (s *CatalogService) CreateCategory(cat *models.Category, userID *uuid.UUID) error {
	if err := s.db.Create(cat).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "categorias", strconv.FormatUint(uint64(cat.ID), 10), "INSERT", nil, cat, userID)
	return nil
}

// Marcas
func (s *CatalogService) ListBrands() ([]models.Brand, error) {
	var list []models.Brand
	err := s.db.Order("nombre ASC").Find(&list).Error
	return list, err
}

func (s *CatalogService) CreateBrand(brand *models.Brand, userID *uuid.UUID) error {
	if err := s.db.Create(brand).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "marcas", strconv.FormatUint(uint64(brand.ID), 10), "INSERT", nil, brand, userID)
	return nil
}

// Modelos
func (s *CatalogService) ListModels(categoriaID, marcaID *uint) ([]models.Model, error) {
	var list []models.Model
	q := s.db.Preload("Marca").Preload("Categoria")
	if categoriaID != nil && *categoriaID > 0 {
		q = q.Where("categoria_id = ?", *categoriaID)
	}
	if marcaID != nil && *marcaID > 0 {
		q = q.Where("marca_id = ?", *marcaID)
	}
	err := q.Order("nombre ASC").Find(&list).Error
	return list, err
}

func (s *CatalogService) CreateModel(model *models.Model, userID *uuid.UUID) error {
	if err := s.db.Create(model).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "modelos", strconv.FormatUint(uint64(model.ID), 10), "INSERT", nil, model, userID)
	return nil
}

// Estados y Proveedores
func (s *CatalogService) ListEquipmentStates() ([]models.EquipmentState, error) {
	var list []models.EquipmentState
	err := s.db.Order("id ASC").Find(&list).Error
	return list, err
}

func (s *CatalogService) ListSuppliers() ([]models.Supplier, error) {
	var list []models.Supplier
	err := s.db.Order("nombre ASC").Find(&list).Error
	return list, err
}

func (s *CatalogService) CreateSupplier(sup *models.Supplier, userID *uuid.UUID) error {
	if err := s.db.Create(sup).Error; err != nil {
		return err
	}
	middleware.AuditLoggerHelper(s.db, "proveedores", strconv.FormatUint(uint64(sup.ID), 10), "INSERT", nil, sup, userID)
	return nil
}
