import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { User } from '../../core/types';
import { Shield, Warehouse as WarehouseIcon, Edit3 } from 'lucide-react';

interface UseUserColumnsProps {
  onOpenWarehouse: (user: User) => void;
  onOpenEdit: (user: User) => void;
}

export const useUserColumns = ({
  onOpenWarehouse,
  onOpenEdit,
}: UseUserColumnsProps): Column<User>[] => {
  return [
    {
      key: 'nombre_completo',
      header: 'Nombre Completo',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-slate-800">{row.nombre_completo}</span>
          <p className="text-[11px] text-slate-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'rol',
      header: 'Rol',
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Shield className="w-3 h-3 mr-1" />
          {row.rol?.nombre}
        </span>
      ),
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (row) => <span className="text-xs text-slate-600">{row.telefono || '—'}</span>,
    },
    {
      key: 'almacenes',
      header: 'Almacenes',
      render: (row) => {
        if (row.rol?.nombre === 'Administrador') {
          return <span className="text-xs text-emerald-600 font-semibold italic">Acceso Total</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {(row.almacenes || []).map((w) => (
              <span key={w.id} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                {w.codigo}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          <button onClick={() => onOpenWarehouse(row)} title="Asignar Almacenes" className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50">
            <WarehouseIcon className="w-4 h-4" />
          </button>
          <button onClick={() => onOpenEdit(row)} title="Editar Usuario" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
};

