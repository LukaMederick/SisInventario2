package database

import (
	"log"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// RunSeeds ejecuta las semillas de datos base
func RunSeeds(db *gorm.DB) {
	log.Println("Verificando semillas iniciales...")

	// 1. Roles
	roles := []models.Role{
		{ID: 1, Nombre: "Administrador", Descripcion: "Acceso total a todos los módulos y almacenes"},
		{ID: 2, Nombre: "Encargado de almacén", Descripcion: "Acceso y gestión exclusiva en almacenes asignados"},
		{ID: 3, Nombre: "Técnico", Descripcion: "Gestión de asignaciones y mantenimientos"},
		{ID: 4, Nombre: "Auditor", Descripcion: "Solo lectura y generación de reportes"},
	}
	for _, r := range roles {
		var count int64
		db.Model(&models.Role{}).Where("id = ? OR nombre = ?", r.ID, r.Nombre).Count(&count)
		if count == 0 {
			db.Create(&r)
		}
	}

	// 2. Estados de equipo
	estados := []models.EquipmentState{
		{ID: 1, Nombre: "Disponible", Descripcion: "Equipo listo para asignarse", Color: "#10b981"},
		{ID: 2, Nombre: "Asignado", Descripcion: "Equipo en uso por un usuario", Color: "#3b82f6"},
		{ID: 3, Nombre: "Mantenimiento", Descripcion: "Equipo en reparación", Color: "#f59e0b"},
		{ID: 4, Nombre: "Baja", Descripcion: "Equipo dado de baja", Color: "#ef4444"},
		{ID: 5, Nombre: "Perdido", Descripcion: "Equipo extraviado", Color: "#64748b"},
	}
	for _, e := range estados {
		var count int64
		db.Model(&models.EquipmentState{}).Where("id = ? OR nombre = ?", e.ID, e.Nombre).Count(&count)
		if count == 0 {
			db.Create(&e)
		}
	}

	// 3. Usuario Administrador por defecto
	adminID := seedAdminUser(db)

	// 4. Almacén Central
	centralWhID := seedCentralWarehouse(db, adminID)

	// 5. Catálogos y datos de prueba
	SeedCatalogsAndInventory(db, adminID, centralWhID)
}

func seedAdminUser(db *gorm.DB) uuid.UUID {
	var user models.User
	if err := db.Where("email = ?", "admin@sisinventario.com").First(&user).Error; err == nil {
		return user.ID
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Admin123*"), bcrypt.DefaultCost)
	adminID := uuid.New()
	admin := models.User{
		ID:             adminID,
		Email:          "admin@sisinventario.com",
		PasswordHash:   string(hashedPassword),
		NombreCompleto: "Administrador del Sistema",
		Telefono:       "+51 987654321",
		RolID:          1,
		Activo:         true,
	}
	db.Create(&admin)
	return adminID
}

func seedCentralWarehouse(db *gorm.DB, adminID uuid.UUID) uint {
	var wh models.Warehouse
	if err := db.Where("codigo = ?", "ALM-01").First(&wh).Error; err == nil {
		return wh.ID
	}

	wh = models.Warehouse{
		Codigo:        "ALM-01",
		Nombre:        "Almacén Central - Sede Principal",
		Direccion:     "Av. Principal 123",
		Ciudad:        "Lima",
		ResponsableID: &adminID,
		Telefono:      "01-555-1234",
		Activo:        true,
	}
	if err := db.Create(&wh).Error; err == nil {
		db.Create(&models.UserWarehouse{UsuarioID: adminID, AlmacenID: wh.ID})
	}
	return wh.ID
}

