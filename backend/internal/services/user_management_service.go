package services

import (
	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// ListUsers lista los usuarios con roles y almacenes
func (s *AuthService) ListUsers() ([]models.User, error) {
	var users []models.User
	err := s.db.Preload("Rol").Preload("Almacenes").Order("nombre_completo ASC").Find(&users).Error
	return users, err
}

// UpdateUser actualiza usuario
func (s *AuthService) UpdateUser(id uuid.UUID, updates map[string]interface{}, editorID *uuid.UUID) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, id).Error; err != nil {
		return nil, err
	}

	if pass, ok := updates["password"]; ok && pass.(string) != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(pass.(string)), bcrypt.DefaultCost)
		if err == nil {
			updates["password_hash"] = string(hashed)
		}
		delete(updates, "password")
	}

	old := user
	if err := s.db.Model(&user).Updates(updates).Error; err != nil {
		return nil, err
	}
	middleware.AuditLoggerHelper(s.db, "usuarios", id.String(), "UPDATE", old, user, editorID)
	return s.GetProfile(id)
}

// AssignUserWarehouses administra relación N:M
func (s *AuthService) AssignUserWarehouses(userID uuid.UUID, almacenesIDs []uint, editorID *uuid.UUID) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("usuario_id = ?", userID).Delete(&models.UserWarehouse{}).Error; err != nil {
			return err
		}
		for _, aid := range almacenesIDs {
			if err := tx.Create(&models.UserWarehouse{UsuarioID: userID, AlmacenID: aid}).Error; err != nil {
				return err
			}
		}
		middleware.AuditLoggerHelper(tx, "usuario_almacen", userID.String(), "UPDATE", nil, almacenesIDs, editorID)
		return nil
	})
}

