import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Movement } from '../../core/types';

const getTipoBadge = (t: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    entrada: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    salida: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
    transferencia: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    ajuste: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    asignacion: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
    devolucion: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
    baja: { bg: 'bg-slate-100 border-slate-300', text: 'text-slate-700' },
  };
  const style = map[t.toLowerCase()] || { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600' };

  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-full border ${style.bg} ${style.text}`}>
      {t}
    </span>
  );
};

export const useMovimientoColumns = (): Column<Movement>[] => {
  return [
    {
      key: 'tipo',
      header: 'Tipo',
      render: (row) => getTipoBadge(row.tipo),
    },
    {
      key: 'elemento',
      header: 'Activo o Insumo',
      render: (row) => (
        <div>
          {row.activo ? (
            <>
              <span className="font-semibold text-xs text-slate-800">{row.activo.codigo_activo}</span>
              <p className="text-[11px] text-slate-500">{row.activo.modelo?.nombre}</p>
            </>
          ) : row.item ? (
            <>
              <span className="font-semibold text-xs text-slate-800">{row.item.nombre}</span>
              <p className="text-[11px] text-slate-400 font-mono">SKU: {row.item.sku}</p>
            </>
          ) : (
            '—'
          )}
        </div>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cant.',
      render: (row) => <span className="font-mono text-xs font-bold text-slate-800">{row.cantidad}</span>,
    },
    {
      key: 'origen_destino',
      header: 'Origen → Destino',
      render: (row) => (
        <div className="text-xs text-slate-600">
          {row.almacen_origen ? <span className="font-medium text-slate-700">{row.almacen_origen.nombre}</span> : ''}
          {row.almacen_origen && (row.almacen_destino || row.usuario_destino) ? ' → ' : ''}
          {row.almacen_destino && <span className="font-semibold text-slate-800">{row.almacen_destino.nombre}</span>}
          {row.usuario_destino && (
            <span className="text-blue-700 font-medium"> ({row.usuario_destino.nombre_completo})</span>
          )}
        </div>
      ),
    },
    {
      key: 'motivo',
      header: 'Motivo / Documento',
      render: (row) => (
        <div>
          <p className="text-xs text-slate-700 truncate max-w-xs">{row.motivo || '—'}</p>
          {row.documento && (
            <span className="text-[10px] text-slate-400 font-mono">Doc: {row.documento}</span>
          )}
        </div>
      ),
    },
    {
      key: 'usuario',
      header: 'Registrado por',
      render: (row) => <span className="text-xs text-slate-500">{row.creador?.nombre_completo || 'Sistema'}</span>,
    },
    {
      key: 'fecha',
      header: 'Fecha y Hora',
      render: (row) => <span className="text-xs text-slate-400">{new Date(row.fecha).toLocaleString()}</span>,
    },
  ];
};

