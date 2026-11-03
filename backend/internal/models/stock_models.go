package models

import (
	"time"

	"github.com/google/uuid"
)

// Item insumos y consumibles controlados cuantitativamente
type Item struct {
	BaseModel
	SKU         string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"sku"`
	Nombre      string    `gorm:"type:varchar(200);not null" json:"nombre"`
	Descripcion string    `gorm:"type:text" json:"descripcion"`
	CategoriaID uint      `gorm:"not null" json:"categoria_id"`
	Categoria   Category  `gorm:"foreignKey:CategoriaID" json:"categoria"`
	MarcaID     *uint     `json:"marca_id"`
	Marca       *Brand    `gorm:"foreignKey:MarcaID" json:"marca,omitempty"`
	Unidad      string    `gorm:"type:varchar(20);default:'unidad'" json:"unidad"`
	StockMinimo int       `gorm:"default:5" json:"stock_minimo"`
	Activo      bool      `gorm:"default:true" json:"activo"`
	Stocks      []Stock   `gorm:"foreignKey:ItemID" json:"stocks,omitempty"`
}

func (Item) TableName() string { return "items" }

// Stock cantidad física de insumos por almacén
type Stock struct {
	ID                uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	ItemID            uint       `gorm:"not null;index:uq_item_almacen,unique" json:"item_id"`
	Item              Item       `gorm:"foreignKey:ItemID" json:"item"`
	AlmacenID         uint       `gorm:"not null;index:uq_item_almacen,unique" json:"almacen_id"`
	Almacen           Warehouse  `gorm:"foreignKey:AlmacenID" json:"almacen"`
	Cantidad          int        `gorm:"default:0" json:"cantidad"`
	CantidadReservada int        `gorm:"default:0" json:"cantidad_reservada"`
	UltimoConteo      *time.Time `json:"ultimo_conteo"`
	UpdatedAt         time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Stock) TableName() string { return "stock" }

// Movement historial de transacciones
type Movement struct {
	ID               uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	Tipo             string     `gorm:"type:varchar(30);not null" json:"tipo"`
	ActivoID         *uint      `json:"activo_id"`
	Activo           *Asset     `gorm:"foreignKey:ActivoID" json:"activo,omitempty"`
	ItemID           *uint      `json:"item_id"`
	Item             *Item      `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	Cantidad         int        `gorm:"default:1" json:"cantidad"`
	AlmacenOrigenID  *uint      `json:"almacen_origen_id"`
	AlmacenOrigen    *Warehouse `gorm:"foreignKey:AlmacenOrigenID" json:"almacen_origen,omitempty"`
	AlmacenDestinoID *uint      `json:"almacen_destino_id"`
	AlmacenDestino   *Warehouse `gorm:"foreignKey:AlmacenDestinoID" json:"almacen_destino,omitempty"`
	UsuarioDestinoID *uuid.UUID `gorm:"type:uuid" json:"usuario_destino_id"`
	UsuarioDestino   *User      `gorm:"foreignKey:UsuarioDestinoID" json:"usuario_destino,omitempty"`
	Motivo           string     `gorm:"type:text" json:"motivo"`
	Documento        string     `gorm:"type:varchar(100)" json:"documento"`
	Fecha            time.Time  `gorm:"autoCreateTime" json:"fecha"`
	CreatedBy        *uuid.UUID `gorm:"type:uuid" json:"created_by"`
	Creador          *User      `gorm:"foreignKey:CreatedBy" json:"creador,omitempty"`
	CreatedAt        time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (Movement) TableName() string { return "movimientos" }

