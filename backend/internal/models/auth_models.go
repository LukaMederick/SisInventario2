package models

import (
	"time"

	"github.com/google/uuid"
)

// Role roles del sistema
type Role struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Nombre      string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"nombre"`
	Descripcion string    `gorm:"type:text" json:"descripcion"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Role) TableName() string { return "roles" }

// User usuarios del sistema
type User struct {
	ID             uuid.UUID   `gorm:"type:uuid;primaryKey" json:"id"`
	Email          string      `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash   string      `gorm:"type:varchar(255);not null" json:"-"`
	NombreCompleto string      `gorm:"type:varchar(255);not null" json:"nombre_completo"`
	Telefono       string      `gorm:"type:varchar(50)" json:"telefono"`
	RolID          uint        `gorm:"not null;default:1" json:"rol_id"`
	Rol            Role        `gorm:"foreignKey:RolID" json:"rol"`
	Activo         bool        `gorm:"default:true" json:"activo"`
	Almacenes      []Warehouse `gorm:"many2many:usuario_almacen;foreignKey:ID;joinForeignKey:UsuarioID;References:ID;joinReferences:AlmacenID" json:"almacenes,omitempty"`
	CreatedAt      time.Time   `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time   `gorm:"autoUpdateTime" json:"updated_at"`
}

func (User) TableName() string { return "usuarios" }

// UserWarehouse relación N:M entre usuario y almacenes autorizados
type UserWarehouse struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UsuarioID uuid.UUID `gorm:"type:uuid;not null;index:uq_usuario_almacen,unique" json:"usuario_id"`
	AlmacenID uint      `gorm:"not null;index:uq_usuario_almacen,unique" json:"almacen_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (UserWarehouse) TableName() string { return "usuario_almacen" }

