import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Assignment } from '../../core/types';
import { Undo2 } from 'lucide-react';

interface UseAsignacionColumnsProps {
  canReturn: boolean;
  onReturn: (assignment: Assignment) => void;
}

export const useAsignacionColumns = ({ canReturn, onReturn }: UseAsignacionColumnsProps): Column<Assignment>[] => [
  {
    key: 'activo',
    header: 'Equipo / Código',
    render: (row) => (
      <div>
        <span className="font-mono font-bold text-xs text-slate-800">{row.activo?.codigo_activo}</span>
        <p className="text-[11px] text-slate-500">{row.activo?.modelo?.nombre} ({row.activo?.modelo?.marca?.nombre})</p>
      </div>
    ),
  },
  {
    key: 'usuario',
    header: 'Colaborador Asignado',
    render: (row) => (
      <div>
        <span className="font-semibold text-xs text-slate-800">{row.usuario?.nombre_completo}</span>
        <p className="text-[11px] text-slate-400">{row.usuario?.email}</p>
      </div>
    ),
  },
  {
    key: 'almacen',
    header: 'Almacén Base',
    render: (row) => <span className="text-xs text-slate-600 font-medium">{row.almacen?.nombre}</span>,
  },
  {
    key: 'fecha_asignacion',
    header: 'Fecha Asignación',
    render: (row) => <span className="text-xs text-slate-600">{new Date(row.fecha_asignacion).toLocaleDateString()}</span>,
  },
  {
    key: 'fecha_devolucion',
    header: 'Fecha Devolución',
    render: (row) => <span className="text-xs text-slate-500">{row.fecha_devolucion ? new Date(row.fecha_devolucion).toLocaleDateString() : '—'}</span>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: (row) => (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${row.estado === 'activa' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
        {row.estado}
      </span>
    ),
  },
  {
    key: 'notas',
    header: 'Notas / Responsiva',
    render: (row) => <span className="text-xs text-slate-500 truncate max-w-xs block">{row.notas || '—'}</span>,
  },
  {
    key: 'acciones',
    header: 'Acción',
    render: (row) =>
      row.estado === 'activa' && canReturn && (
        <button onClick={() => onReturn(row)} title="Devolver al Almacén" className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition">
          <Undo2 className="w-3.5 h-3.5 mr-1" />
          Devolver
        </button>
      ),
  },
];
