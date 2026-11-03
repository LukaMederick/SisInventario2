import React from 'react';
import { EquipmentState } from '../../../core/types';

interface EstadosTabProps {
  estados: EquipmentState[];
}

export const EstadosTab: React.FC<EstadosTabProps> = ({ estados }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 mb-4">Estados Operativos de Equipos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {estados.map((e) => (
          <div key={e.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center space-x-3 text-xs">
            <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
            <div>
              <span className="font-bold text-slate-800">{e.nombre}</span>
              <p className="text-slate-500 text-[11px]">{e.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

