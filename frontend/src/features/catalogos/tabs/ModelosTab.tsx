import React from 'react';
import { Plus } from 'lucide-react';
import { Model } from '../../../core/types';

interface ModelosTabProps {
  modelos: Model[];
  canEdit: boolean;
  onOpenCreate: () => void;
}

export const ModelosTab: React.FC<ModelosTabProps> = ({ modelos, canEdit, onOpenCreate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Catálogo de Modelos</h3>
        {canEdit && (
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nuevo Modelo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modelos.map((m) => (
          <div key={m.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition">
            <p className="font-bold text-xs text-slate-800">{m.nombre}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Marca: <strong className="text-slate-700">{m.marca?.nombre}</strong> • Categoría: <strong className="text-slate-700">{m.categoria?.nombre}</strong>
            </p>
            {m.especificaciones && m.especificaciones !== '{}' && (
              <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                {m.especificaciones}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

