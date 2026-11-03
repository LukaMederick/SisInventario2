import React from 'react';
import { Plus } from 'lucide-react';
import { Brand } from '../../../core/types';

interface MarcasTabProps {
  marcas: Brand[];
  canEdit: boolean;
  onOpenCreate: () => void;
}

export const MarcasTab: React.FC<MarcasTabProps> = ({ marcas, canEdit, onOpenCreate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Marcas Registradas</h3>
        {canEdit && (
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nueva Marca
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {marcas.map((b) => (
          <span key={b.id} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            {b.nombre}
          </span>
        ))}
      </div>
    </div>
  );
};

