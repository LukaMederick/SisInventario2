import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { EquipmentState } from '../../../core/types';

interface EstadosTabProps {
  estados: EquipmentState[];
  canEdit: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (st: EquipmentState) => void;
  onDelete: (id: number) => void;
}

export const EstadosTab: React.FC<EstadosTabProps> = ({
  estados, canEdit, onOpenCreate, onOpenEdit, onDelete,
}) => {
  const [search, setSearch] = useState('');

  const filtered = estados.filter((e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (e.descripcion && e.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">Estados de Equipo</h3>
        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          {canEdit && (
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nuevo
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">NOMBRE</th>
              <th className="py-2.5 px-3">DESCRIPCIÓN</th>
              <th className="py-2.5 px-3">COLOR</th>
              <th className="py-2.5 px-3 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-3 font-semibold text-slate-800">{e.nombre}</td>
                <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{e.descripcion || '—'}</td>
                <td className="py-3 px-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium text-white shadow-sm"
                    style={{ backgroundColor: e.color || '#6366f1' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
                    {e.color || '#6366f1'}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  {canEdit && (
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => onOpenEdit(e)} className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition" title="Editar">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(e.id)} className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="Eliminar">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
