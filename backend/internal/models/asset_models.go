package models

import (
	"time"

	"github.com/google/uuid"
)

// Asset equipos y activos serializados
type Asset struct {
	BaseModel
	CodigoActivo     string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"codigo_activo"`
	NumeroSerie      string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"numero_serie"`
	ModeloID         uint           `gorm:"not null" json:"modelo_id"`
	Modelo           Model          `gorm:"foreignKey:ModeloID" json:"modelo"`
	AlmacenID        uint           `gorm:"not null" json:"almacen_id"`
	Almacen          Warehouse      `gorm:"foreignKey:AlmacenID" json:"almacen"`
	EstadoID         uint           `gorm:"not null" json:"estado_id"`
	Estado           EquipmentState `gorm:"foreignKey:EstadoID" json:"estado"`
	ProveedorID      *uint          `json:"proveedor_id"`
	Proveedor        *Supplier      `gorm:"foreignKey:ProveedorID" json:"proveedor,omitempty"`
	FechaCompra      *time.Time     `gorm:"type:date" json:"fecha_compra"`
	Precio           float64        `gorm:"type:numeric(12,2);default:0.00" json:"precio"`
	GarantiaHasta    *time.Time     `gorm:"type:date" json:"garantia_hasta"`
	Condicion        string         `gorm:"type:varchar(50);default:'nuevo'" json:"condicion"`
	UbicacionDetalle string         `gorm:"type:text" json:"ubicacion_detalle"`
	AsignadoA        *uuid.UUID     `gorm:"type:uuid" json:"asignado_a"`
	UsuarioAsignado  *User          `gorm:"foreignKey:AsignadoA" json:"usuario_asignado,omitempty"`
	Notas            string         `gorm:"type:text" json:"notas"`
	Activo           bool           `gorm:"default:true" json:"activo"`
	CreatedBy        *uuid.UUID     `gorm:"type:uuid" json:"created_by"`
	Creador          *User          `gorm:"foreignKey:CreatedBy" json:"creador,omitempty"`
}

func (Asset) TableName() string { return "activos" }

// Assignment asignaciones de equipos a colaboradores
type Assignment struct {
	ID              uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	ActivoID        uint       `gorm:"not null" json:"activo_id"`
	Activo          Asset      `gorm:"foreignKey:ActivoID" json:"activo"`
	AsignadoA       uuid.UUID  `gorm:"type:uuid;not null" json:"asignado_a"`
	Usuario         User       `gorm:"foreignKey:AsignadoA" json:"usuario"`
	AlmacenID       uint       `gorm:"not null" json:"almacen_id"`
	Almacen         Warehouse  `gorm:"foreignKey:AlmacenID" json:"almacen"`
	FechaAsignacion time.Time  `gorm:"autoCreateTime" json:"fecha_asignacion"`
	FechaDevolucion *time.Time `json:"fecha_devolucion"`
	Estado          string     `gorm:"type:varchar(20);default:'activa'" json:"estado"`
	Notas           string     `gorm:"type:text" json:"notas"`
	CreatedBy       *uuid.UUID `gorm:"type:uuid" json:"created_by"`
	Creador         *User      `gorm:"foreignKey:CreatedBy" json:"creador,omitempty"`
	CreatedAt       time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (Assignment) TableName() string { return "asignaciones" }

// Maintenance gestión de servicios de mantenimiento
type Maintenance struct {
	BaseModel
	ActivoID    uint      `gorm:"not null" json:"activo_id"`
	Activo      Asset     `gorm:"foreignKey:ActivoID" json:"activo"`
	Tipo        string    `gorm:"type:varchar(30);not null" json:"tipo"`
	Descripcion string    `gorm:"type:text;not null" json:"descripcion"`
	ProveedorID *uint     `json:"proveedor_id"`
	Proveedor   *Supplier `gorm:"foreignKey:ProveedorID" json:"proveedor,omitempty"`
	Costo       float64   `gorm:"type:numeric(10,2);default:0.00" json:"costo"`
	FechaInicio time.Time `gorm:"type:date;not null" json:"fecha_inicio"`
	FechaFin    *time.Time `gorm:"type:date" json:"fecha_fin"`
	Estado      string    `gorm:"type:varchar(30);default:'pendiente'" json:"estado"`
	CreatedBy   *uuid.UUID `gorm:"type:uuid" json:"created_by"`
	Creador     *User     `gorm:"foreignKey:CreatedBy" json:"creador,omitempty"`
}

func (Maintenance) TableName() string { return "mantenimientos" }

