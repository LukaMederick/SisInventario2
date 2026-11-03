import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Asset } from '../../core/types';
import { Badge } from '../../shared/components/Badge';
import { Eye, ArrowRightLeft, Undo2, UserCheck } from 'lucide-react';

interface UseActivoColumnsProps {
  hasRole: (...roles: string[]) => boolean;
  onOpenDetail: (asset: Asset) => void;
  onOpenTransfer: (asset: Asset) => void;
  onOpenAssign: (asset: Asset) => void;
  onOpenReturn: (asset: Asset) => void;
}

export const useActivoColumns = ({
  hasRole,
  onOpenDetail,
  onOpenTransfer,
  onOpenAssign,
  onOpenReturn,
}: UseActivoColumnsProps): Column<Asset>[] => {
  return [
    {
      key: 'codigo_activo',
      header: 'Código / Serie',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-800 text-xs">{row.codigo_activo}</span>
          <p className="text-[11px] text-slate-400 font-mono">S/N: {row.numero_serie}</p>
        </div>
      ),
    },
    {
      key: 'modelo',
      header: 'Equipo / Modelo',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{row.modelo?.nombre || '—'}</span>
          <p className="text-[11px] text-slate-500">{row.modelo?.marca?.nombre} • {row.modelo?.categoria?.nombre}</p>
        </div>
      ),
    },
    {
      key: 'almacen',
      header: 'Almacén',
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.almacen?.nombre || '—'}</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => <Badge color={row.estado?.color || '#6366f1'}>{row.estado?.nombre || 'Disponible'}</Badge>,
    },
    {
      key: 'asignado_a',
      header: 'Asignado a',
      render: (row) =>
        row.usuario_asignado ? (
          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            {row.usuario_asignado.nombre_completo}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin asignar</span>
        ),
    },
    {
      key: 'precio',
      header: 'Valor',
      render: (row) => <span className="font-mono text-xs text-slate-700">${Number(row.precio || 0).toFixed(2)}</span>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <button onClick={() => onOpenDetail(row)} title="Ver Detalle" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <Eye className="w-4 h-4" />
          </button>
          {hasRole('Administrador', 'Encargado de almacén') && (
            <button onClick={() => onOpenTransfer(row)} title="Transferir" className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50">
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          )}
          {row.estado?.nombre === 'Asignado' ? (
            <button onClick={() => onOpenReturn(row)} title="Devolver" className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50">
              <Undo2 className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => onOpenAssign(row)} title="Asignar" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
              <UserCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];
};

