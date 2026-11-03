package models

import (
	"time"

	"github.com/google/uuid"
)

// Audit registro inmutable de auditoría
type Audit struct {
	ID              uint64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Tabla           string     `gorm:"type:varchar(50);not null" json:"tabla"`
	RegistroID      string     `gorm:"type:varchar(100);not null" json:"registro_id"`
	Accion          string     `gorm:"type:varchar(20);not null" json:"accion"`
	DatosAnteriores string     `gorm:"type:jsonb" json:"datos_anteriores"`
	DatosNuevos     string     `gorm:"type:jsonb" json:"datos_nuevos"`
	UsuarioID       *uuid.UUID `gorm:"type:uuid" json:"usuario_id"`
	Usuario         *User      `gorm:"foreignKey:UsuarioID" json:"usuario,omitempty"`
	CreatedAt       time.Time  `gorm:"autoCreateTime" json:"created_at"`
}

func (Audit) TableName() string { return "auditoria" }

