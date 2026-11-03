import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { DashboardMetrics } from '../../core/types';
import { Link } from 'react-router-dom';
import { KpiGrid } from './KpiGrid';
import { DistributionCharts } from './DistributionCharts';
import { RecentMovementsTable } from './RecentMovementsTable';

export const Dashboard: React.FC = () => {
  const { selectedWarehouse } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedWarehouse) params.almacen_id = selectedWarehouse.id;
        const res = await api.get('/dashboard', { params });
        setMetrics(res.data);
      } catch (err) {
        console.error('Error al cargar métricas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [selectedWarehouse]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Cargando métricas del inventario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Control</h2>
          <p className="text-xs text-slate-500 mt-1">
            Resumen global de activos, insumos y movimientos en{' '}
            <strong className="text-slate-700">{selectedWarehouse ? selectedWarehouse.nombre : 'Todos los Almacenes'}</strong>
          </p>
        </div>
        <Link
          to="/activos"
          className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
        >
          <span>Gestionar Activos</span>
          <ArrowUpRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      <KpiGrid metrics={metrics} />
      <DistributionCharts metrics={metrics} />
      <RecentMovementsTable movimientos={metrics?.movimientos_recientes || []} />
    </div>
  );
};
