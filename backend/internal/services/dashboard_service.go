package services

import (
	"github.com/LukaMederick/SisInventario2/backend/internal/models"
	"gorm.io/gorm"
)

type DashboardService struct {
	db *gorm.DB
}

func NewDashboardService(db *gorm.DB) *DashboardService {
	return &DashboardService{db: db}
}

type DashboardMetrics struct {
	TotalActivos             int64                    `json:"total_activos"`
	ValorTotalInventario     float64                  `json:"valor_total_inventario"`
	ActivosAsignados         int64                    `json:"activos_asignados"`
	EnMantenimiento          int64                    `json:"en_mantenimiento"`
	ItemsStockCritico        int64                    `json:"items_stock_critico"`
	TotalInsumos             int64                    `json:"total_insumos"`
	DistribucionPorEstado    []map[string]interface{} `json:"distribucion_por_estado"`
	DistribucionPorCategoria []map[string]interface{} `json:"distribucion_por_categoria"`
	MovimientosRecientes     []models.Movement        `json:"movimientos_recientes"`
}

func (s *DashboardService) GetMetrics(almacenID *uint) (*DashboardMetrics, error) {
	metrics := &DashboardMetrics{}

	assetQ := s.db.Model(&models.Asset{}).Where("activo = true")
	if almacenID != nil && *almacenID > 0 {
		assetQ = assetQ.Where("almacen_id = ?", *almacenID)
	}

	assetQ.Count(&metrics.TotalActivos)

	type SumResult struct{ Total float64 }
	var sumRes SumResult
	assetQ.Select("COALESCE(SUM(precio), 0) as total").Scan(&sumRes)
	metrics.ValorTotalInventario = sumRes.Total

	// Activos asignados y en mantenimiento
	metrics.ActivosAsignados = s.countAssetsByState("Asignado", almacenID)
	metrics.EnMantenimiento = s.countAssetsByState("Mantenimiento", almacenID)

	// Insumos y stock crítico
	s.db.Model(&models.Item{}).Where("activo = true").Count(&metrics.TotalInsumos)
	metrics.ItemsStockCritico = s.countCriticalStock(almacenID)

	// Distribución y movimientos
	metrics.DistribucionPorEstado = s.getDistributionByState(almacenID)
	metrics.DistribucionPorCategoria = s.getDistributionByCategory(almacenID)
	metrics.MovimientosRecientes = s.getRecentMovements(almacenID)

	return metrics, nil
}

func (s *DashboardService) countAssetsByState(estado string, almacenID *uint) int64 {
	var count int64
	var st models.EquipmentState
	s.db.Where("nombre = ?", estado).First(&st)
	if st.ID > 0 {
		q := s.db.Model(&models.Asset{}).Where("activo = true AND estado_id = ?", st.ID)
		if almacenID != nil && *almacenID > 0 {
			q = q.Where("almacen_id = ?", *almacenID)
		}
		q.Count(&count)
	}
	return count
}

func (s *DashboardService) countCriticalStock(almacenID *uint) int64 {
	var count int64
	q := s.db.Table("stock").Joins("JOIN items ON items.id = stock.item_id").Where("stock.cantidad <= items.stock_minimo")
	if almacenID != nil && *almacenID > 0 {
		q = q.Where("stock.almacen_id = ?", *almacenID)
	}
	q.Count(&count)
	return count
}
