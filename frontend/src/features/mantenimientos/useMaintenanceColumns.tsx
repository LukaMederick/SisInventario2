import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Maintenance } from '../../core/types';
import { CheckCircle2 } from 'lucide-react';

interface UseMaintenanceColumnsProps {
  canUpdate: boolean;
  onUpdate: (maintenance: Maintenance) => void;
}

export const useMaintenanceColumns = ({
  canUpdate,
  onUpdate,
}: UseMaintenanceColumnsProps): Column<Maintenance>[] => {
  return [
    {
      key: 'activo',
      header: 'Equipo / Código',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-slate-800">{row.activo?.codigo_activo}</span>
          <p className="text-[11px] text-slate-500">{row.activo?.modelo?.nombre}</p>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (row) => <span className="capitalize text-xs font-semibold text-slate-700">{row.tipo}</span>,
    },
    {
      key: 'descripcion',
      header: 'Diagnóstico / Trabajo',
      render: (row) => <p className="text-xs text-slate-600 max-w-xs truncate">{row.descripcion}</p>,
    },
    {
      key: 'costo',
      header: 'Costo',
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-800">${Number(row.costo).toFixed(2)}</span>,
    },
    {
      key: 'fechas',
      header: 'Inicio',
      render: (row) => <span className="text-xs text-slate-500">{new Date(row.fecha_inicio).toLocaleDateString()}</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <span className="capitalize px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold text-[10px]">
          {row.estado}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acción',
      render: (row) =>
        canUpdate && row.estado !== 'completado' && row.estado !== 'cancelado' && (
          <button
            onClick={() => onUpdate(row)}
            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Actualizar
          </button>
        ),
    },
  ];
};

