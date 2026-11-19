import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';

interface StatePieChartProps {
  data: { nombre: string; color: string; total: number }[];
  total: number;
}

const C = 2 * Math.PI * 54; // ~339.29

export const StatePieChart: React.FC<StatePieChartProps> = ({ data, total }) => {
  let accumulatedOffset = 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center">
          <PieIcon className="w-4 h-4 mr-2 text-emerald-600" />
          Distribución por Estado de Equipo
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Gráfico Circular</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
        {/* SVG Donut / Pie */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" className="stroke-slate-100" strokeWidth="18" fill="transparent" />
            {total > 0 && data.map((item, idx) => {
              const sliceLength = (item.total / total) * C;
              const currentOffset = accumulatedOffset;
              accumulatedOffset += sliceLength;
              return (
                <circle
                  key={idx}
                  cx="70"
                  cy="70"
                  r="54"
                  fill="transparent"
                  stroke={item.color || '#10b981'}
                  strokeWidth="18"
                  strokeDasharray={`${sliceLength} ${C}`}
                  strokeDashoffset={-currentOffset}
                  className="transition-all duration-700 hover:opacity-85"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 leading-none">{total}</span>
            <span className="text-[10px] text-slate-400 font-semibold mt-1">Activos</span>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex-1 w-full space-y-2">
          {data.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Sin datos de estado</p>
          ) : (
            data.map((item, idx) => {
              const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
              return (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-slate-700 truncate">{item.nombre}</span>
                  </div>
                  <span className="font-semibold text-slate-800 ml-2 flex-shrink-0">
                    {item.total} <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

