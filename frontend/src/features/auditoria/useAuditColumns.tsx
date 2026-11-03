import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { AuditLog } from '../../core/types';
import { Eye } from 'lucide-react';

const getActionBadge = (act: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    INSERT: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    UPDATE: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    DELETE: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
  };
  const style = map[act] || { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style.bg} ${style.text}`}>
      {act}
    </span>
  );
};

export const useAuditColumns = (onViewDiff: (log: AuditLog) => void): Column<AuditLog>[] => {
  return [
    {
      key: 'accion',
      header: 'Operación',
      render: (row) => getActionBadge(row.accion),
    },
    {
      key: 'tabla',
      header: 'Entidad / Tabla',
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-800">{row.tabla}</span>,
    },
    {
      key: 'registro_id',
      header: 'ID Registro',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.registro_id}</span>,
    },
    {
      key: 'usuario',
      header: 'Usuario Responsable',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">
          {row.usuario?.nombre_completo || 'Sistema / Trigger'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Fecha y Hora',
      render: (row) => <span className="text-xs text-slate-400">{new Date(row.created_at).toLocaleString()}</span>,
    },
    {
      key: 'diff',
      header: 'Detalle (Diff)',
      render: (row) => (
        <button
          onClick={() => onViewDiff(row)}
          className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
          Ver Cambios
        </button>
      ),
    },
  ];
};

