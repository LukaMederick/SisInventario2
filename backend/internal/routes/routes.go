package routes

import (
	"github.com/LukaMederick/SisInventario2/backend/internal/handlers"
	"github.com/LukaMederick/SisInventario2/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

type RouterContainer struct {
	Auth        *handlers.AuthHandler
	User        *handlers.UserHandler
	Asset       *handlers.AssetHandler
	Stock       *handlers.StockHandler
	Movement    *handlers.MovementHandler
	Assignment  *handlers.AssignmentHandler
	Maintenance *handlers.MaintenanceHandler
	Catalog     *handlers.CatalogHandler
	Warehouse   *handlers.WarehouseHandler
	Dashboard   *handlers.DashboardHandler
	Audit       *handlers.AuditHandler
}

func SetupRoutes(r *gin.Engine, c *RouterContainer) {
	api := r.Group("/api")
	api.POST("/auth/login", c.Auth.Login)

	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware())
	adminOnly := middleware.RequireRoles("Administrador")
	adminOrWarehouse := middleware.RequireRoles("Administrador", "Encargado de almacén")
	techRoles := middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico")

	protected.GET("/auth/profile", c.Auth.GetProfile)
	protected.GET("/roles", c.Auth.ListRoles)
	protected.GET("/dashboard", c.Dashboard.GetMetrics)

	// Activos
	act := protected.Group("/activos")
	act.GET("", c.Asset.List)
	act.GET("/:id", c.Asset.GetByID)
	act.POST("", techRoles, c.Asset.Create)
	act.PUT("/:id", techRoles, c.Asset.Update)
	act.DELETE("/:id", adminOnly, c.Asset.Delete)
	act.POST("/:id/transferir", adminOrWarehouse, c.Asset.Transferir)
	act.POST("/:id/asignar", techRoles, c.Asset.Asignar)
	act.POST("/:id/devolver", techRoles, c.Asset.Devolver)

	// Items y Stock
	protected.GET("/items", c.Stock.ListItems)
	protected.GET("/items/:id", c.Stock.GetItemByID)
	protected.POST("/items", adminOrWarehouse, c.Stock.CreateItem)
	protected.PUT("/items/:id", adminOrWarehouse, c.Stock.UpdateItem)
	protected.GET("/stock", c.Stock.GetStockByWarehouse)
	protected.GET("/stock/critico", c.Stock.GetCriticalStock)
	protected.POST("/stock/ajustar", adminOrWarehouse, c.Stock.AjustarStock)
	protected.POST("/stock/entrada", adminOrWarehouse, c.Stock.RegistrarEntrada)

	// Movimientos, Asignaciones, Mantenimientos
	protected.GET("/movimientos", c.Movement.List)
	protected.POST("/movimientos", techRoles, c.Movement.Create)
	protected.GET("/asignaciones", c.Assignment.List)
	protected.GET("/mantenimientos", c.Maintenance.List)
	protected.POST("/mantenimientos", techRoles, c.Maintenance.Create)
	protected.PUT("/mantenimientos/:id/estado", techRoles, c.Maintenance.UpdateStatus)

	// Catálogos
	protected.GET("/categorias", c.Catalog.ListCategories)
	protected.POST("/categorias", adminOnly, c.Catalog.CreateCategory)
	protected.GET("/marcas", c.Catalog.ListBrands)
	protected.POST("/marcas", adminOnly, c.Catalog.CreateBrand)
	protected.GET("/modelos", c.Catalog.ListModels)
	protected.POST("/modelos", adminOnly, c.Catalog.CreateModel)
	protected.GET("/estados-equipo", c.Catalog.ListEquipmentStates)
	protected.POST("/estados-equipo", adminOnly, c.Catalog.CreateEquipmentState)
	protected.PUT("/estados-equipo/:id", adminOnly, c.Catalog.UpdateEquipmentState)
	protected.DELETE("/estados-equipo/:id", adminOnly, c.Catalog.DeleteEquipmentState)
	protected.GET("/proveedores", c.Catalog.ListSuppliers)
	protected.POST("/proveedores", adminOrWarehouse, c.Catalog.CreateSupplier)

	// Almacenes
	protected.GET("/almacenes", c.Warehouse.List)
	protected.POST("/almacenes", adminOnly, c.Warehouse.Create)
	protected.PUT("/almacenes/:id", adminOnly, c.Warehouse.Update)

	// Usuarios y Auditoría
	protected.GET("/usuarios", adminOnly, c.User.List)
	protected.POST("/usuarios", adminOnly, c.User.Create)
	protected.PUT("/usuarios/:id", adminOnly, c.User.Update)
	protected.POST("/usuarios/:id/almacenes", adminOnly, c.User.AssignWarehouses)
	protected.GET("/auditoria", middleware.RequireRoles("Administrador", "Auditor"), c.Audit.List)
}
