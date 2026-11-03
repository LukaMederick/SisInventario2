import React from 'react';
import { TrendingUp, Boxes } from 'lucide-react';
import { DashboardMetrics } from '../../core/types';

interface DistributionChartsProps {
  metrics: DashboardMetrics | null;
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ metrics }) => {
  const totalAct = metrics?.total_activos || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución por Estado */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 flex items-center mb-4">
          <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
          Distribución por Estado de Equipo
        </h3>
        <div className="space-y-3">
          {(metrics?.distribucion_por_estado || []).map((item, idx) => {
            const pct = Math.round((item.total / totalAct) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    {item.nombre}
                  </span>
                  <span className="font-semibold text-slate-800">{item.total} ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribución por Categoría */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 flex items-center mb-4">
          <Boxes className="w-4 h-4 mr-2 text-indigo-600" />
          Activos por Categoría
        </h3>
        <div className="space-y-3">
          {(metrics?.distribucion_por_categoria || []).map((cat, idx) => {
            const pct = Math.round((cat.total / totalAct) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{cat.categoria}</span>
                  <span className="font-semibold text-slate-800">{cat.total} ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

