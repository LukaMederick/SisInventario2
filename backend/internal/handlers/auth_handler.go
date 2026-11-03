package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	BaseHandler
	Service *services.AuthService
}

func NewAuthHandler(s *services.AuthService) *AuthHandler {
	return &AuthHandler{Service: s}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, "Email y contraseña requeridos")
		return
	}

	resp, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		h.JSONError(c, http.StatusUnauthorized, err.Error())
		return
	}

	h.JSONSuccess(c, resp)
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := h.GetUserID(c)
	if userID == nil {
		h.JSONError(c, http.StatusUnauthorized, "No autenticado")
		return
	}

	user, err := h.Service.GetProfile(*userID)
	if err != nil {
		h.JSONError(c, http.StatusNotFound, "Usuario no encontrado")
		return
	}

	h.JSONSuccess(c, user)
}

func (h *AuthHandler) ListRoles(c *gin.Context) {
	roles, err := h.Service.ListRoles()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, roles)
}

