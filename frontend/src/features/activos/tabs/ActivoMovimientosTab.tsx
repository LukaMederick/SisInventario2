import React from 'react';
import { Movement } from '../../../core/types';

interface ActivoMovimientosTabProps {
  movimientos: Movement[];
  loading: boolean;
}

export const ActivoMovimientosTab: React.FC<ActivoMovimientosTabProps> = ({ movimientos, loading }) => {
  if (loading) {
    return <p className="text-center py-6 text-xs text-slate-400">Cargando bitácora...</p>;
  }

  if (movimientos.length === 0) {
    return <p className="text-center py-6 text-xs text-slate-400">No hay movimientos registrados para este activo</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-[10px] uppercase font-semibold text-slate-500">
          <tr>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Origen / Destino</th>
            <th className="px-3 py-2">Motivo</th>
            <th className="px-3 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td className="px-3 py-2.5 font-semibold capitalize text-slate-800">{m.tipo}</td>
              <td className="px-3 py-2.5">
                {m.almacen_origen?.nombre || ''}
                {m.almacen_origen && m.almacen_destino ? ' → ' : ''}
                {m.almacen_destino?.nombre || ''}
                {m.usuario_destino ? ` (Usuario: ${m.usuario_destino.nombre_completo})` : ''}
              </td>
              <td className="px-3 py-2.5">{m.motivo || '—'}</td>
              <td className="px-3 py-2.5 text-slate-400">{new Date(m.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

