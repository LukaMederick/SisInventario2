package middleware

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var JwtSecret = []byte(getSecret())

func getSecret() string {
	if s := os.Getenv("JWT_SECRET"); s != "" {
		return s
	}
	return "sisinventario-super-secret-key-2026-production"
}

type CustomClaims struct {
	UserID       uuid.UUID `json:"user_id"`
	Email        string    `json:"email"`
	RolID        uint      `json:"rol_id"`
	RolNombre    string    `json:"rol_nombre"`
	AlmacenesIDs []uint    `json:"almacenes_ids"`
	jwt.RegisteredClaims
}

func GenerateToken(user *models.User, almacenesIDs []uint) (string, error) {
	claims := CustomClaims{
		UserID:       user.ID,
		Email:        user.Email,
		RolID:        user.RolID,
		RolNombre:    user.Rol.Nombre,
		AlmacenesIDs: almacenesIDs,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "sisinventario-api",
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(JwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Cabecera Authorization requerida"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Formato inválido. Uso: Bearer <token>"})
			return
		}

		claims := &CustomClaims{}
		token, err := jwt.ParseWithClaims(parts[1], claims, func(t *jwt.Token) (interface{}, error) {
			return JwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("rol_id", claims.RolID)
		c.Set("rol_nombre", claims.RolNombre)
		c.Set("almacenes_ids", claims.AlmacenesIDs)
		c.Next()
	}
}
