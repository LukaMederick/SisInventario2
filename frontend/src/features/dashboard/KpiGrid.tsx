import React from 'react';
import { Laptop, DollarSign, UserCheck, Wrench, AlertTriangle, Boxes } from 'lucide-react';
import { DashboardMetrics } from '../../core/types';

interface KpiGridProps {
  metrics: DashboardMetrics | null;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ metrics }) => {
  const kpis = [
    { title: 'Total Activos', value: metrics?.total_activos || 0, icon: Laptop, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Valor Inventario', value: `$${(metrics?.valor_total_inventario || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Asignados', value: metrics?.activos_asignados || 0, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'En Mantenimiento', value: metrics?.en_mantenimiento || 0, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Stock Crítico', value: metrics?.items_stock_critico || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', alert: (metrics?.items_stock_critico || 0) > 0 },
    { title: 'Total Insumos', value: metrics?.total_insumos || 0, icon: Boxes, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((k, idx) => {
        const Icon = k.icon;
        return (
          <div key={idx} className={`p-4 rounded-2xl bg-white border ${k.alert ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200/80'} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">{k.title}</span>
              <div className={`p-2 rounded-xl ${k.bg} ${k.color}`}><Icon className="w-4 h-4" /></div>
            </div>
            <p className="text-xl font-bold text-slate-800">{k.value}</p>
          </div>
        );
      })}
    </div>
  );
};

