package handlers

import (
	"net/http"

	"github.com/LukaMederick/SisInventario2/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	BaseHandler
	Service *services.AuthService
}

func NewUserHandler(s *services.AuthService) *UserHandler {
	return &UserHandler{Service: s}
}

type CreateUserRequest struct {
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password" binding:"required,min=6"`
	NombreCompleto string `json:"nombre_completo" binding:"required"`
	Telefono       string `json:"telefono"`
	RolID          uint   `json:"rol_id" binding:"required"`
}

func (h *UserHandler) List(c *gin.Context) {
	users, err := h.Service.ListUsers()
	if err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}
	h.JSONSuccess(c, users)
}

func (h *UserHandler) Create(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	creatorID := h.GetUserID(c)
	user, err := h.Service.Register(req.Email, req.Password, req.NombreCompleto, req.Telefono, req.RolID, creatorID)
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) Update(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, "ID inválido")
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	editorID := h.GetUserID(c)
	user, err := h.Service.UpdateUser(targetID, updates, editorID)
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.JSONSuccess(c, user)
}

type AssignWarehousesRequest struct {
	AlmacenesIDs []uint `json:"almacenes_ids"`
}

func (h *UserHandler) AssignWarehouses(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		h.JSONError(c, http.StatusBadRequest, "ID inválido")
		return
	}

	var req AssignWarehousesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	editorID := h.GetUserID(c)
	if err := h.Service.AssignUserWarehouses(targetID, req.AlmacenesIDs, editorID); err != nil {
		h.JSONError(c, http.StatusInternalServerError, err.Error())
		return
	}

	h.JSONSuccess(c, gin.H{"message": "Permisos actualizados correctamente"})
}

