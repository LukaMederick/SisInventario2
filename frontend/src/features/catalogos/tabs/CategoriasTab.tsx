import React from 'react';
import { Plus } from 'lucide-react';
import { Category } from '../../../core/types';

interface CategoriasTabProps {
  categorias: Category[];
  canEdit: boolean;
  onOpenCreate: () => void;
}

export const CategoriasTab: React.FC<CategoriasTabProps> = ({ categorias, canEdit, onOpenCreate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Categorías de Inventario</h3>
        {canEdit && (
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nueva Categoría
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {categorias.map((c) => (
          <div key={c.id} className="py-2.5 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-800">{c.nombre}</span>
              <p className="text-slate-500 text-[11px]">{c.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

