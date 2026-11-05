import { useState } from 'react';
import api from '../../core/api/axios.config';
import { exportToExcel } from './exportExcel';
import { exportTablePdf } from './exportPdf';

export function useReports() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const exportActivos = async (format: 'excel' | 'pdf') => {
    setLoadingKey('activos');
    try {
      const res = await api.get('/activos', { params: { limit: 1000 } });
      const items = res.data?.data || [];
      if (format === 'excel') {
        exportToExcel(items.map((a: any) => ({
          'Código': a.codigo_activo, 'Serie': a.numero_serie, 'Modelo': a.modelo?.nombre,
          'Marca': a.modelo?.marca?.nombre, 'Categoría': a.modelo?.categoria?.nombre,
          'Almacén': a.almacen?.nombre, 'Estado': a.estado?.nombre, 'Condición': a.condicion,
          'Precio ($)': a.precio, 'Ubicación': a.ubicacion_detalle || '—',
        })), 'Inventario_Activos');
      } else {
        const headers = ['Código', 'Serie', 'Modelo', 'Marca', 'Almacén', 'Estado', 'Condición', 'Precio ($)'];
        const rows = items.map((a: any) => [
          a.codigo_activo, a.numero_serie, a.modelo?.nombre || '—', a.modelo?.marca?.nombre || '—',
          a.almacen?.nombre || '—', a.estado?.nombre || '—', a.condicion || '—', `$${Number(a.precio || 0).toFixed(2)}`,
        ]);
        exportTablePdf('Reporte General de Activos Informáticos', headers, rows, 'Inventario_Activos');
      }
    } catch { alert('Error al exportar activos'); }
    finally { setLoadingKey(null); }
  };

  const exportStock = async (format: 'excel' | 'pdf') => {
    setLoadingKey('stock');
    try {
      const res = await api.get('/stock');
      const items = res.data || [];
      if (format === 'excel') {
        exportToExcel(items.map((s: any) => ({
          'SKU': s.item?.sku, 'Insumo': s.item?.nombre, 'Almacén': s.almacen?.nombre,
          'Cantidad Actual': s.cantidad, 'Stock Mínimo': s.item?.stock_minimo,
          'Estado': s.cantidad <= s.item?.stock_minimo ? 'STOCK CRÍTICO' : 'NORMAL',
        })), 'Control_Stock');
      } else {
        const headers = ['SKU', 'Insumo / Repuesto', 'Almacén', 'Stock Actual', 'Mínimo', 'Alerta'];
        const rows = items.map((s: any) => [
          s.item?.sku || '—', s.item?.nombre || '—', s.almacen?.nombre || '—',
          s.cantidad, s.item?.stock_minimo, s.cantidad <= s.item?.stock_minimo ? 'CRÍTICO' : 'OK',
        ]);
        exportTablePdf('Niveles de Stock y Alertas de Insumos', headers, rows, 'Control_Stock');
      }
    } catch { alert('Error al exportar stock'); }
    finally { setLoadingKey(null); }
  };

  const exportMovimientos = async () => {
    setLoadingKey('movimientos');
    try {
      const res = await api.get('/movimientos', { params: { limit: 1000 } });
      exportToExcel((res.data?.data || []).map((m: any) => ({
        'Fecha': new Date(m.created_at).toLocaleString(), 'Tipo': m.tipo,
        'Insumo': m.item?.nombre, 'Almacén': m.almacen?.nombre, 'Cantidad': m.cantidad,
        'Motivo': m.motivo || '—', 'Usuario': m.usuario?.nombre_completo || 'Sistema',
      })), 'Kardex_Movimientos');
    } catch { alert('Error al exportar movimientos'); }
    finally { setLoadingKey(null); }
  };

  const exportMantenimientos = async (format: 'excel' | 'pdf') => {
    setLoadingKey('mantenimientos');
    try {
      const res = await api.get('/mantenimientos', { params: { limit: 1000 } });
      const items = res.data?.data || [];
      if (format === 'excel') {
        exportToExcel(items.map((mt: any) => ({
          'ID': mt.id, 'Activo': `${mt.activo?.codigo_activo} - ${mt.activo?.modelo?.nombre}`,
          'Tipo': mt.tipo, 'Estado': mt.estado, 'Costo ($)': mt.costo,
          'Proveedor / Taller': mt.proveedor?.nombre || 'Interno',
          'Fecha Inicio': mt.fecha_inicio ? mt.fecha_inicio.split('T')[0] : '—',
        })), 'Historial_Mantenimientos');
      } else {
        const headers = ['ID', 'Activo', 'Tipo', 'Estado', 'Costo ($)', 'Taller / Proveedor', 'Fecha'];
        const rows = items.map((mt: any) => [
          mt.id, `${mt.activo?.codigo_activo || '—'}`, mt.tipo, mt.estado,
          `$${Number(mt.costo || 0).toFixed(2)}`, mt.proveedor?.nombre || 'Interno',
          mt.fecha_inicio ? mt.fecha_inicio.split('T')[0] : '—',
        ]);
        exportTablePdf('Historial de Mantenimientos Técnicos', headers, rows, 'Historial_Mantenimientos');
      }
    } catch { alert('Error al exportar mantenimientos'); }
    finally { setLoadingKey(null); }
  };

  return { loadingKey, exportActivos, exportStock, exportMovimientos, exportMantenimientos };
}
