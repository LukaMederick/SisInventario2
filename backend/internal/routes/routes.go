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
	{
		// Rutas públicas
		api.POST("/auth/login", c.Auth.Login)

		// Rutas protegidas por JWT
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Auth & Dashboard
			protected.GET("/auth/profile", c.Auth.GetProfile)
			protected.GET("/roles", c.Auth.ListRoles)
			protected.GET("/dashboard", c.Dashboard.GetMetrics)

			// Activos
			act := protected.Group("/activos")
			{
				act.GET("", c.Asset.List)
				act.GET("/:id", c.Asset.GetByID)
				act.POST("", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Asset.Create)
				act.PUT("/:id", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Asset.Update)
				act.DELETE("/:id", middleware.RequireRoles("Administrador"), c.Asset.Delete)
				act.POST("/:id/transferir", middleware.RequireRoles("Administrador", "Encargado de almacén"), c.Asset.Transferir)
				act.POST("/:id/asignar", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Asset.Asignar)
				act.POST("/:id/devolver", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Asset.Devolver)
			}

			// Insumos y Stock
			itm := protected.Group("/items")
			{
				itm.GET("", c.Stock.ListItems)
				itm.GET("/:id", c.Stock.GetItemByID)
				itm.POST("", middleware.RequireRoles("Administrador", "Encargado de almacén"), c.Stock.CreateItem)
				itm.PUT("/:id", middleware.RequireRoles("Administrador", "Encargado de almacén"), c.Stock.UpdateItem)
			}

			stk := protected.Group("/stock")
			{
				stk.GET("", c.Stock.GetStockByWarehouse)
				stk.GET("/critico", c.Stock.GetCriticalStock)
				stk.POST("/ajustar", middleware.RequireRoles("Administrador", "Encargado de almacén"), c.Stock.AjustarStock)
				stk.POST("/entrada", middleware.RequireRoles("Administrador", "Encargado de almacén"), c.Stock.RegistrarEntrada)
			}

			// Movimientos, Asignaciones, Mantenimientos
			protected.GET("/movimientos", c.Movement.List)
			protected.GET("/asignaciones", c.Assignment.List)
			protected.GET("/mantenimientos", c.Maintenance.List)
			protected.POST("/mantenimientos", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Maintenance.Create)
			protected.PUT("/mantenimientos/:id/estado", middleware.RequireRoles("Administrador", "Encargado de almacén", "Técnico"), c.Maintenance.UpdateStatus)

			// Catálogos
			protected.GET("/categorias", c.Catalog.ListCategories)
			protected.POST("/categorias", middleware.RequireRoles("Administrador"), c.Catalog.CreateCategory)
			protected.GET("/marcas", c.Catalog.ListBrands)
			protected.POST("/marcas", middleware.RequireRoles("Administrador"), c.Catalog.CreateBrand)
			protected.GET("/modelos", c.Catalog.ListModels)
			protected.POST("/modelos", middleware.RequireRoles("Administrador"), c.Catalog.CreateModel)
			protected.GET("/estados-equipo", c.Catalog.ListEquipmentStates)
			protected.GET("/proveedores", c.Catalog.ListSuppliers)
			protected.POST("/proveedores", middleware.RequireRoles("Administrador"), c.Catalog.CreateSupplier)

			// Almacenes
			protected.GET("/almacenes", c.Warehouse.List)
			protected.POST("/almacenes", middleware.RequireRoles("Administrador"), c.Warehouse.Create)
			protected.PUT("/almacenes/:id", middleware.RequireRoles("Administrador"), c.Warehouse.Update)

			// Usuarios y Auditoría
			protected.GET("/usuarios", middleware.RequireRoles("Administrador"), c.User.List)
			protected.POST("/usuarios", middleware.RequireRoles("Administrador"), c.User.Create)
			protected.PUT("/usuarios/:id", middleware.RequireRoles("Administrador"), c.User.Update)
			protected.POST("/usuarios/:id/almacenes", middleware.RequireRoles("Administrador"), c.User.AssignWarehouses)
			protected.GET("/auditoria", middleware.RequireRoles("Administrador", "Auditor"), c.Audit.List)
		}
	}
}

