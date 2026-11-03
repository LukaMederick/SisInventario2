package database

import (
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SeedCatalogsAndInventory carga catálogos e inventario inicial
func SeedCatalogsAndInventory(db *gorm.DB, adminID uuid.UUID, whID uint) {
	// Categorías
	var catCount int64
	db.Model(&models.Category{}).Count(&catCount)
	if catCount == 0 {
		db.Create(&models.Category{Nombre: "Hardware y Cómputo", Descripcion: "Laptops, Servidores y PCs"})
		db.Create(&models.Category{Nombre: "Periféricos y Accesorios", Descripcion: "Monitores, Teclados, Mouses"})
		db.Create(&models.Category{Nombre: "Redes y Telecomunicaciones", Descripcion: "Switches, Access Points"})
		db.Create(&models.Category{Nombre: "Insumos y Consumibles", Descripcion: "Cables, Conectores, Discos"})
	}

	// Marcas
	var brandCount int64
	db.Model(&models.Brand{}).Count(&brandCount)
	if brandCount == 0 {
		for _, m := range []string{"Dell", "HP", "Lenovo", "Cisco", "Logitech", "Kingston"} {
			db.Create(&models.Brand{Nombre: m})
		}
	}

	// Proveedor
	var supCount int64
	db.Model(&models.Supplier{}).Count(&supCount)
	if supCount == 0 {
		db.Create(&models.Supplier{
			Nombre: "TechSupply Perú S.A.C.", RUC: "20123456789", Contacto: "Carlos Mendoza",
			Telefono: "+51 987111222", Email: "ventas@techsupply.pe", Direccion: "Av. La Marina 2500",
		})
	}

	// Modelos, Insumos y Activos iniciales
	seedSampleItemsAndAssets(db, adminID, whID)
}

func seedSampleItemsAndAssets(db *gorm.DB, adminID uuid.UUID, whID uint) {
	var catHW, catIns models.Category
	db.Where("nombre = ?", "Hardware y Cómputo").First(&catHW)
	db.Where("nombre = ?", "Insumos y Consumibles").First(&catIns)

	var brandDell, brandKingston models.Brand
	db.Where("nombre = ?", "Dell").First(&brandDell)
	db.Where("nombre = ?", "Kingston").First(&brandKingston)

	var sup models.Supplier
	db.First(&sup)

	var modDell models.Model
	if brandDell.ID > 0 && catHW.ID > 0 {
		db.Where("nombre = ?", "Latitude 5420").FirstOrCreate(&modDell, models.Model{
			MarcaID: brandDell.ID, CategoriaID: catHW.ID, Nombre: "Latitude 5420",
			Especificaciones: `{"ram":"16GB DDR4","ssd":"512GB NVMe"}`, Activo: true,
		})
	}

	// Activos iniciales
	var assetCount int64
	db.Model(&models.Asset{}).Count(&assetCount)
	if assetCount == 0 && modDell.ID > 0 {
		now := time.Now()
		db.Create(&models.Asset{
			CodigoActivo: "ACT-2026-001", NumeroSerie: "DELL-LAT-5420-SN001",
			ModeloID: modDell.ID, AlmacenID: whID, EstadoID: 1, ProveedorID: &sup.ID,
			FechaCompra: &now, Precio: 1250.00, Condicion: "nuevo",
			UbicacionDetalle: "Rack Central - Estante 1", Activo: true, CreatedBy: &adminID,
		})
	}

	// Insumos iniciales
	var itemCount int64
	db.Model(&models.Item{}).Count(&itemCount)
	if itemCount == 0 && catIns.ID > 0 {
		item := models.Item{
			SKU: "REP-SSD-512GB", Nombre: "Disco Sólido SSD 512GB Kingston NV2 NVMe",
			CategoriaID: catIns.ID, MarcaID: &brandKingston.ID, Unidad: "unidad",
			StockMinimo: 4, Activo: true,
		}
		if err := db.Create(&item).Error; err == nil {
			now := time.Now()
			db.Create(&models.Stock{ItemID: item.ID, AlmacenID: whID, Cantidad: 15, UltimoConteo: &now})
		}
	}
}

