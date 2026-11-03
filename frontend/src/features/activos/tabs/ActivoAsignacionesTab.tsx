import React from 'react';
import { Assignment } from '../../../core/types';

interface ActivoAsignacionesTabProps {
  asignaciones: Assignment[];
  loading: boolean;
}

export const ActivoAsignacionesTab: React.FC<ActivoAsignacionesTabProps> = ({ asignaciones, loading }) => {
  if (loading) {
    return <p className="text-center py-6 text-xs text-slate-400">Cargando asignaciones...</p>;
  }

  if (asignaciones.length === 0) {
    return <p className="text-center py-6 text-xs text-slate-400">No se registran asignaciones para este equipo</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-[10px] uppercase font-semibold text-slate-500">
          <tr>
            <th className="px-3 py-2">Colaborador</th>
            <th className="px-3 py-2">Almacén</th>
            <th className="px-3 py-2">Fecha Asignación</th>
            <th className="px-3 py-2">Fecha Devolución</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Notas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {asignaciones.map((a) => (
            <tr key={a.id}>
              <td className="px-3 py-2.5 font-semibold text-slate-800">{a.usuario?.nombre_completo}</td>
              <td className="px-3 py-2.5">{a.almacen?.nombre}</td>
              <td className="px-3 py-2.5">{new Date(a.fecha_asignacion).toLocaleDateString()}</td>
              <td className="px-3 py-2.5">
                {a.fecha_devolucion ? new Date(a.fecha_devolucion).toLocaleDateString() : '—'}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    a.estado === 'activa'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {a.estado}
                </span>
              </td>
              <td className="px-3 py-2.5 text-slate-500">{a.notas || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

