import React from 'react';
import { BarChart2 } from 'lucide-react';

interface CategoryBarChartProps {
  data: { categoria: string; total: number }[];
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center">
          <BarChart2 className="w-4 h-4 mr-2 text-indigo-600" />
          Activos por Categoría
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Diagrama de Barras</span>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-12">Sin categorías registradas</p>
      ) : (
        <div className="space-y-2">
          <div className="h-40 flex items-end justify-around gap-2 pt-6 px-2 border-b border-slate-100">
            {data.map((item, idx) => {
              const heightPct = Math.max(Math.round((item.total / maxVal) * 100), 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group min-w-[48px] max-w-[80px]">
                  <span className="text-[11px] font-bold text-indigo-600 mb-1 group-hover:scale-110 transition-transform">
                    {item.total}
                  </span>
                  <div className="w-full bg-slate-100/80 rounded-t-xl h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-violet-400 rounded-t-xl transition-all duration-700 group-hover:brightness-110 shadow-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-around gap-2 px-2 pt-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex-1 min-w-[48px] max-w-[80px] text-center">
                <span className="text-[10px] font-medium text-slate-500 block truncate" title={item.categoria}>
                  {item.categoria}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

