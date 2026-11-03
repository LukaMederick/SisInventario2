package main

import (
	"log"
	"net/http"
	"os"

	"github.com/LukaMederick/SisInventario2/backend/internal/handlers"
	"github.com/LukaMederick/SisInventario2/backend/internal/routes"
	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/LukaMederick/SisInventario2/backend/pkg/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	db := database.InitDB()

	// Inyección de dependencias (IoC / Clean Architecture)
	authSvc := services.NewAuthService(db)
	assetSvc := services.NewAssetService(db)
	stockSvc := services.NewStockService(db)
	maintSvc := services.NewMaintenanceService(db)
	movSvc := services.NewMovementService(db)
	asigSvc := services.NewAssignmentService(db)
	catSvc := services.NewCatalogService(db)
	dashSvc := services.NewDashboardService(db)
	auditSvc := services.NewAuditService(db)

	container := &routes.RouterContainer{
		Auth:        handlers.NewAuthHandler(authSvc),
		User:        handlers.NewUserHandler(authSvc),
		Asset:       handlers.NewAssetHandler(assetSvc),
		Stock:       handlers.NewStockHandler(stockSvc),
		Movement:    handlers.NewMovementHandler(movSvc),
		Assignment:  handlers.NewAssignmentHandler(asigSvc),
		Maintenance: handlers.NewMaintenanceHandler(maintSvc),
		Catalog:     handlers.NewCatalogHandler(catSvc),
		Warehouse:   handlers.NewWarehouseHandler(catSvc),
		Dashboard:   handlers.NewDashboardHandler(dashSvc),
		Audit:       handlers.NewAuditHandler(auditSvc),
	}

	r := gin.Default()
	setupCORS(r)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "system": "SisInventario API Clean Architecture"})
	})

	routes.SetupRoutes(r, container)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("SisInventario API escuchando en puerto :%s", port)
	_ = r.Run(":" + port)
}

func setupCORS(r *gin.Engine) {
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
}

