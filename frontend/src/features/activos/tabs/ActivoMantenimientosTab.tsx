import React from 'react';
import { Maintenance } from '../../../core/types';

interface ActivoMantenimientosTabProps {
  mantenimientos: Maintenance[];
  loading: boolean;
}

export const ActivoMantenimientosTab: React.FC<ActivoMantenimientosTabProps> = ({ mantenimientos, loading }) => {
  if (loading) {
    return <p className="text-center py-6 text-xs text-slate-400">Cargando mantenimientos...</p>;
  }

  if (mantenimientos.length === 0) {
    return <p className="text-center py-6 text-xs text-slate-400">No se registran mantenimientos para este equipo</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-[10px] uppercase font-semibold text-slate-500">
          <tr>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Descripción</th>
            <th className="px-3 py-2">Proveedor</th>
            <th className="px-3 py-2">Costo</th>
            <th className="px-3 py-2">Fecha Inicio</th>
            <th className="px-3 py-2">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mantenimientos.map((m) => (
            <tr key={m.id}>
              <td className="px-3 py-2.5 capitalize font-semibold">{m.tipo}</td>
              <td className="px-3 py-2.5 max-w-xs truncate">{m.descripcion}</td>
              <td className="px-3 py-2.5">{m.proveedor?.nombre || 'Interno'}</td>
              <td className="px-3 py-2.5 font-mono">${Number(m.costo).toFixed(2)}</td>
              <td className="px-3 py-2.5">{new Date(m.fecha_inicio).toLocaleDateString()}</td>
              <td className="px-3 py-2.5">
                <span className="capitalize px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold text-[10px]">
                  {m.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

