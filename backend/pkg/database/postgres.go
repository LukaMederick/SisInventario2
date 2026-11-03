package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDB conecta a PostgreSQL, ejecuta migraciones y carga datos iniciales
func InitDB() *gorm.DB {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbname := getEnv("DB_NAME", "sisinventario")
	sslmode := getEnv("DB_SSLMODE", "disable")

	ensureDatabaseExists(host, port, user, password, dbname, sslmode)

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
		host, port, user, password, dbname, sslmode,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Error al conectar a PostgreSQL: %v", err)
	}

	if sqlDB, err := DB.DB(); err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	log.Println("Conexión exitosa a PostgreSQL")
	runMigrations(DB)
	RunSeeds(DB)

	return DB
}

func ensureDatabaseExists(host, port, user, password, dbname, sslmode string) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=postgres sslmode=%s", host, port, user, password, sslmode)
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		return
	}
	defer db.Close()

	var exists bool
	query := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '%s')", dbname)
	if err := db.QueryRow(query).Scan(&exists); err == nil && !exists {
		log.Printf("Creando base de datos '%s' automáticamente...", dbname)
		_, _ = db.Exec(fmt.Sprintf("CREATE DATABASE \"%s\"", dbname))
	}
}

func runMigrations(db *gorm.DB) {
	log.Println("Ejecutando migraciones automáticas...")
	_ = db.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.Warehouse{},
		&models.UserWarehouse{},
		&models.Category{},
		&models.Brand{},
		&models.Model{},
		&models.EquipmentState{},
		&models.Supplier{},
		&models.Asset{},
		&models.Item{},
		&models.Stock{},
		&models.Movement{},
		&models.Assignment{},
		&models.Maintenance{},
		&models.Audit{},
	)
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
