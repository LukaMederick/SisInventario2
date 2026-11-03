import React from 'react';
import { MapPin, Phone, User as UserIcon } from 'lucide-react';
import { Warehouse } from '../../core/types';

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse: w }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {w.codigo}
          </span>
          <h3 className="font-bold text-sm text-slate-800 mt-1">{w.nombre}</h3>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
            w.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {w.activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 flex-shrink-0" />
          <span className="truncate">{w.direccion || 'Sin dirección registrada'} ({w.ciudad || '—'})</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-3.5 h-3.5 mr-2 text-slate-400 flex-shrink-0" />
          <span>{w.telefono || 'Sin teléfono'}</span>
        </div>
        <div className="flex items-center">
          <UserIcon className="w-3.5 h-3.5 mr-2 text-slate-400 flex-shrink-0" />
          <span>Responsable: <strong>{w.responsable?.nombre_completo || 'No asignado'}</strong></span>
        </div>
      </div>
    </div>
  );
};

