package middleware

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func RequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		rolNombre, exists := c.Get("rol_nombre")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
			return
		}

		userRol := rolNombre.(string)
		for _, r := range roles {
			if strings.EqualFold(userRol, r) {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "Acceso denegado: roles autorizados: " + strings.Join(roles, ", "),
		})
	}
}

func RequireWarehouseAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		rolNombre, _ := c.Get("rol_nombre")
		if strings.EqualFold(rolNombre.(string), "Administrador") {
			c.Next()
			return
		}

		almacenParam := c.Param("almacen_id")
		if almacenParam == "" {
			almacenParam = c.Query("almacen_id")
		}

		if almacenParam != "" {
			if targetID, err := strconv.ParseUint(almacenParam, 10, 32); err == nil {
				if almacenes, ok := c.Get("almacenes_ids"); ok {
					userAlmacenes := almacenes.([]uint)
					for _, aid := range userAlmacenes {
						if aid == uint(targetID) {
							c.Next()
							return
						}
					}
					c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Sin permisos sobre el almacén"})
					return
				}
			}
		}
		c.Next()
	}
}

func AuditLoggerHelper(db *gorm.DB, tabla, registroID, accion string, oldData, newData interface{}, userID *uuid.UUID) {
	var oldJSON, newJSON string
	if oldData != nil {
		if b, err := json.Marshal(oldData); err == nil {
			oldJSON = string(b)
		}
	}
	if newData != nil {
		if b, err := json.Marshal(newData); err == nil {
			newJSON = string(b)
		}
	}

	audit := models.Audit{
		Tabla:           tabla,
		RegistroID:      registroID,
		Accion:          accion,
		DatosAnteriores: oldJSON,
		DatosNuevos:     newJSON,
		UsuarioID:       userID,
		CreatedAt:       time.Now(),
	}
	db.Create(&audit)
}

