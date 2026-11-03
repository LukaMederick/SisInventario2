package repository

import "gorm.io/gorm"

// IRepository interfaz genérica para operaciones CRUD (Principio de Inversión de Dependencias)
type IRepository[T any] interface {
	FindAll(dest *[]T) error
	FindByID(id any, dest *T) error
	Create(entity *T) error
	Update(entity *T) error
	Delete(id any) error
}

// BaseRepository clase base reutilizable (Herencia/Composición en Go)
type BaseRepository[T any] struct {
	DB *gorm.DB
}

func NewBaseRepository[T any](db *gorm.DB) *BaseRepository[T] {
	return &BaseRepository[T]{DB: db}
}

func (r *BaseRepository[T]) FindAll(dest *[]T) error {
	return r.DB.Find(dest).Error
}

func (r *BaseRepository[T]) FindByID(id any, dest *T) error {
	return r.DB.First(dest, id).Error
}

func (r *BaseRepository[T]) Create(entity *T) error {
	return r.DB.Create(entity).Error
}

func (r *BaseRepository[T]) Update(entity *T) error {
	return r.DB.Save(entity).Error
}

func (r *BaseRepository[T]) Delete(id any) error {
	var entity T
	return r.DB.Delete(&entity, id).Error
}

