import React from 'react';
import { Link } from 'react-router-dom';
import { Movement } from '../../core/types';

interface RecentMovementsTableProps {
  movimientos: Movement[];
}

export const RecentMovementsTable: React.FC<RecentMovementsTableProps> = ({ movimientos }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Últimos Movimientos del Inventario</h3>
          <p className="text-xs text-slate-500 mt-0.5">Operaciones recientes en el sistema</p>
        </div>
        <Link to="/movimientos" className="text-xs font-semibold text-emerald-600 hover:underline">
          Ver toda la bitácora &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Elemento</th>
              <th className="px-5 py-3">Cantidad</th>
              <th className="px-5 py-3">Origen / Destino</th>
              <th className="px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movimientos.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">Sin movimientos</td></tr>
            ) : (
              movimientos.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold capitalize text-slate-800">{m.tipo}</td>
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {m.activo ? m.activo.codigo_activo : m.item ? m.item.nombre : '—'}
                  </td>
                  <td className="px-5 py-3 font-mono">{m.cantidad}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {m.almacen_origen?.nombre || ''}
                    {m.almacen_origen && (m.almacen_destino || m.usuario_destino) ? ' → ' : ''}
                    {m.almacen_destino?.nombre || m.usuario_destino?.nombre_completo || ''}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{new Date(m.fecha).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

