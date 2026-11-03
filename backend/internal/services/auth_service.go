package services

import (
	"errors"

	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

type LoginResponse struct {
	Token        string      `json:"token"`
	User         models.User `json:"user"`
	AlmacenesIDs []uint      `json:"almacenes_ids"`
}

func (s *AuthService) Login(email, password string) (*LoginResponse, error) {
	var user models.User
	err := s.db.Preload("Rol").Preload("Almacenes").Where("email = ?", email).First(&user).Error
	if err != nil || !user.Activo {
		return nil, errors.New("credenciales inválidas o usuario inactivo")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("credenciales inválidas")
	}

	var almacenesIDs []uint
	for _, w := range user.Almacenes {
		almacenesIDs = append(almacenesIDs, w.ID)
	}

	token, err := middleware.GenerateToken(&user, almacenesIDs)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{Token: token, User: user, AlmacenesIDs: almacenesIDs}, nil
}

func (s *AuthService) Register(email, password, nombre, tel string, rolID uint, creadorID *uuid.UUID) (*models.User, error) {
	var count int64
	s.db.Model(&models.User{}).Where("email = ?", email).Count(&count)
	if count > 0 {
		return nil, errors.New("correo ya registrado")
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	user := models.User{
		ID: uuid.New(), Email: email, PasswordHash: string(hashed),
		NombreCompleto: nombre, Telefono: tel, RolID: rolID, Activo: true,
	}
	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}
	middleware.AuditLoggerHelper(s.db, "usuarios", user.ID.String(), "INSERT", nil, user, creadorID)
	return &user, nil
}

func (s *AuthService) GetProfile(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := s.db.Preload("Rol").Preload("Almacenes").First(&user, id).Error
	return &user, err
}

func (s *AuthService) ListRoles() ([]models.Role, error) {
	var roles []models.Role
	err := s.db.Order("id ASC").Find(&roles).Error
	return roles, err
}
