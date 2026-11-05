package services

import (
	"errors"
	"math"
	"strconv"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AjustarStock TRANSACCIÓN ACID
func (s *StockService) AjustarStock(itemID, almacenID uint, nuevaCantidad int, motivo string, userID *uuid.UUID) error {
	if nuevaCantidad < 0 { return errors.New("la cantidad no puede ser negativa") }
	return s.db.Transaction(func(tx *gorm.DB) error {
		var stock models.Stock
		anterior := 0
		now := time.Now()

		err := tx.Where("item_id = ? AND almacen_id = ?", itemID, almacenID).First(&stock).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			stock = models.Stock{ItemID: itemID, AlmacenID: almacenID, Cantidad: nuevaCantidad, UltimoConteo: &now}
			if err := tx.Create(&stock).Error; err != nil { return err }
		} else if err != nil {
			return err
		} else {
			anterior = stock.Cantidad
			old := stock
			stock.Cantidad = nuevaCantidad
			stock.UltimoConteo = &now
			_ = tx.Save(&stock)
			middleware.AuditLoggerHelper(tx, "stock", strconv.FormatUint(uint64(stock.ID), 10), "UPDATE", old, stock, userID)
		}
		diff := int(math.Abs(float64(nuevaCantidad - anterior)))
		mov := models.Movement{Tipo: "ajuste", ItemID: &itemID, Cantidad: diff, AlmacenOrigenID: &almacenID, Motivo: motivo, Fecha: now, CreatedBy: userID}
		return tx.Create(&mov).Error
	})
}

// RegistrarEntradaInventario TRANSACCIÓN ACID
func (s *StockService) RegistrarEntradaInventario(itemID, almacenID uint, cantidad int, documento, motivo string, userID *uuid.UUID) error {
	if cantidad <= 0 { return errors.New("cantidad debe ser mayor a 0") }
	return s.db.Transaction(func(tx *gorm.DB) error {
		var stock models.Stock
		now := time.Now()
		err := tx.Where("item_id = ? AND almacen_id = ?", itemID, almacenID).First(&stock).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			stock = models.Stock{ItemID: itemID, AlmacenID: almacenID, Cantidad: cantidad, UltimoConteo: &now}
			if err := tx.Create(&stock).Error; err != nil { return err }
		} else if err != nil {
			return err
		} else {
			old := stock
			stock.Cantidad += cantidad
			stock.UltimoConteo = &now
			_ = tx.Save(&stock)
			middleware.AuditLoggerHelper(tx, "stock", strconv.FormatUint(uint64(stock.ID), 10), "UPDATE", old, stock, userID)
		}
		mov := models.Movement{Tipo: "entrada", ItemID: &itemID, Cantidad: cantidad, AlmacenDestinoID: &almacenID, Documento: documento, Motivo: motivo, Fecha: now, CreatedBy: userID}
		return tx.Create(&mov).Error
	})
}

// ListCriticalStock obtiene items con stock menor o igual al mínimo
func (s *StockService) ListCriticalStock() ([]map[string]interface{}, error) {
	type Result struct {
		StockID uint `json:"stock_id"`; ItemID uint `json:"item_id"`
		SKU string `json:"sku"`; ItemNombre string `json:"item_nombre"`
		Unidad string `json:"unidad"`; StockMinimo int `json:"stock_minimo"`
		Cantidad int `json:"cantidad"`; AlmacenID uint `json:"almacen_id"`; AlmacenNom string `json:"almacen_nombre"`
	}
	var results []Result
	err := s.db.Table("stock").
		Select("stock.id as stock_id, stock.item_id, items.sku, items.nombre as item_nombre, items.unidad, items.stock_minimo, stock.cantidad, stock.almacen_id, almacenes.nombre as almacen_nom").
		Joins("JOIN items ON items.id = stock.item_id").Joins("JOIN almacenes ON almacenes.id = stock.almacen_id").
		Where("stock.cantidad <= items.stock_minimo").Order("stock.cantidad ASC").Scan(&results).Error

	var output []map[string]interface{}
	for _, r := range results {
		output = append(output, map[string]interface{}{
			"stock_id": r.StockID, "item_id": r.ItemID, "sku": r.SKU, "item_nombre": r.ItemNombre,
			"unidad": r.Unidad, "stock_minimo": r.StockMinimo, "cantidad": r.Cantidad, "almacen_id": r.AlmacenID, "almacen_nombre": r.AlmacenNom,
		})
	}
	return output, err
}
