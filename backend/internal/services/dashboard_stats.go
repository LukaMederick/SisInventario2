package services

import (
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
)

func (s *DashboardService) getDistributionByState(almacenID *uint) []map[string]interface{} {
	type EstadoStat struct {
		Nombre string
		Color  string
		Total  int64
	}
	var stats []EstadoStat
	q := s.db.Table("activos").Select("estados_equipo.nombre, estados_equipo.color, COUNT(activos.id) as total").
		Joins("JOIN estados_equipo ON estados_equipo.id = activos.estado_id").Where("activos.activo = true")
	if almacenID != nil && *almacenID > 0 {
		q = q.Where("activos.almacen_id = ?", *almacenID)
	}
	q.Group("estados_equipo.nombre, estados_equipo.color").Scan(&stats)

	var output []map[string]interface{}
	for _, es := range stats {
		output = append(output, map[string]interface{}{"nombre": es.Nombre, "color": es.Color, "total": es.Total})
	}
	return output
}

func (s *DashboardService) getDistributionByCategory(almacenID *uint) []map[string]interface{} {
	type CatStat struct {
		Nombre string
		Total  int64
	}
	var stats []CatStat
	q := s.db.Table("activos").Select("categorias.nombre, COUNT(activos.id) as total").
		Joins("JOIN modelos ON modelos.id = activos.modelo_id").
		Joins("JOIN categorias ON categorias.id = modelos.categoria_id").Where("activos.activo = true")
	if almacenID != nil && *almacenID > 0 {
		q = q.Where("activos.almacen_id = ?", *almacenID)
	}
	q.Group("categorias.nombre").Scan(&stats)

	var output []map[string]interface{}
	for _, cs := range stats {
		output = append(output, map[string]interface{}{"categoria": cs.Nombre, "total": cs.Total})
	}
	return output
}

func (s *DashboardService) getRecentMovements(almacenID *uint) []models.Movement {
	var list []models.Movement
	q := s.db.Model(&models.Movement{}).
		Preload("Activo.Modelo").Preload("Item").Preload("AlmacenOrigen").
		Preload("AlmacenDestino").Preload("UsuarioDestino").Preload("Creador")
	if almacenID != nil && *almacenID > 0 {
		q = q.Where("almacen_origen_id = ? OR almacen_destino_id = ?", *almacenID, *almacenID)
	}
	q.Order("fecha DESC").Limit(8).Find(&list)
	return list
}

