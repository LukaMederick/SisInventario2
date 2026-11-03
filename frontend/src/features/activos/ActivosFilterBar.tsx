import React from 'react';
import { Filter } from 'lucide-react';
import { Category, EquipmentState } from '../../core/types';

interface ActivosFilterBarProps {
  categorias: Category[];
  estados: EquipmentState[];
  categoriaID: string;
  estadoID: string;
  search: string;
  onCategoriaChange: (id: string) => void;
  onEstadoChange: (id: string) => void;
  onClear: () => void;
}

export const ActivosFilterBar: React.FC<ActivosFilterBarProps> = ({
  categorias,
  estados,
  categoriaID,
  estadoID,
  search,
  onCategoriaChange,
  onEstadoChange,
  onClear,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center text-xs font-semibold text-slate-500 mr-1">
        <Filter className="w-3.5 h-3.5 mr-1" />
        Filtros:
      </div>

      <select
        value={categoriaID}
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none"
      >
        <option value="">Todas las Categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <select
        value={estadoID}
        onChange={(e) => onEstadoChange(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none"
      >
        <option value="">Todos los Estados</option>
        {estados.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>

      {(categoriaID || estadoID || search) && (
        <button onClick={onClear} className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto">
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

