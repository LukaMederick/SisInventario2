package models

import (
	"time"

	"github.com/google/uuid"
)

// Warehouse sedes y almacenes
type Warehouse struct {
	BaseModel
	Codigo        string     `gorm:"type:varchar(50);uniqueIndex;not null" json:"codigo"`
	Nombre        string     `gorm:"type:varchar(150);not null" json:"nombre"`
	Direccion     string     `gorm:"type:text" json:"direccion"`
	Ciudad        string     `gorm:"type:varchar(100)" json:"ciudad"`
	ResponsableID *uuid.UUID `gorm:"type:uuid" json:"responsable_id"`
	Responsable   *User      `gorm:"foreignKey:ResponsableID" json:"responsable,omitempty"`
	Telefono      string     `gorm:"type:varchar(50)" json:"telefono"`
	Activo        bool       `gorm:"default:true" json:"activo"`
}

func (Warehouse) TableName() string { return "almacenes" }

// Category categorías jerárquicas
type Category struct {
	ID               uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	Nombre           string     `gorm:"type:varchar(100);not null" json:"nombre"`
	Descripcion      string     `gorm:"type:text" json:"descripcion"`
	CategoriaPadreID *uint      `json:"categoria_padre_id"`
	CategoriaPadre   *Category  `gorm:"foreignKey:CategoriaPadreID" json:"categoria_padre,omitempty"`
	Subcategorias    []Category `gorm:"foreignKey:CategoriaPadreID" json:"subcategorias,omitempty"`
	CreatedAt        time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (Category) TableName() string { return "categorias" }

// Brand marcas registradas
type Brand struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Nombre    string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"nombre"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Brand) TableName() string { return "marcas" }

// Model modelos de hardware
type Model struct {
	BaseModel
	MarcaID          uint     `gorm:"not null" json:"marca_id"`
	Marca            Brand    `gorm:"foreignKey:MarcaID" json:"marca"`
	CategoriaID      uint     `gorm:"not null" json:"categoria_id"`
	Categoria        Category `gorm:"foreignKey:CategoriaID" json:"categoria"`
	Nombre           string   `gorm:"type:varchar(150);not null" json:"nombre"`
	Especificaciones string   `gorm:"type:jsonb;default:'{}'" json:"especificaciones"`
	ImagenURL        string   `gorm:"type:text" json:"imagen_url"`
	Activo           bool     `gorm:"default:true" json:"activo"`
}

func (Model) TableName() string { return "modelos" }

// EquipmentState estados del activo
type EquipmentState struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Nombre      string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"nombre"`
	Descripcion string    `gorm:"type:text" json:"descripcion"`
	Color       string    `gorm:"type:varchar(20);default:'#6366f1'" json:"color"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (EquipmentState) TableName() string { return "estados_equipo" }

// Supplier directorio de proveedores
type Supplier struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Nombre    string    `gorm:"type:varchar(200);not null" json:"nombre"`
	RUC       string    `gorm:"type:varchar(20);uniqueIndex" json:"ruc"`
	Contacto  string    `gorm:"type:varchar(150)" json:"contacto"`
	Telefono  string    `gorm:"type:varchar(50)" json:"telefono"`
	Email     string    `gorm:"type:varchar(150)" json:"email"`
	Direccion string    `gorm:"type:text" json:"direccion"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Supplier) TableName() string { return "proveedores" }

