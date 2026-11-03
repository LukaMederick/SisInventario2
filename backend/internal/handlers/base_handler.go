package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// BaseHandler clase base para controladores (Herencia / Composición OOP)
type BaseHandler struct{}

func (b *BaseHandler) GetUserID(c *gin.Context) *uuid.UUID {
	val, exists := c.Get("user_id")
	if !exists {
		return nil
	}
	id, ok := val.(uuid.UUID)
	if !ok {
		return nil
	}
	return &id
}

func (b *BaseHandler) ParsePagination(c *gin.Context) (int, int) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 50
	}
	return page, limit
}

func (b *BaseHandler) JSONError(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"error": msg})
}

func (b *BaseHandler) JSONSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, data)
}

