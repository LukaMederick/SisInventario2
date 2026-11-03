import React from 'react';
import { Category } from '../../core/types';

interface ItemsFilterBarProps {
  categoriaID: string;
  setCategoriaID: (val: string) => void;
  categorias: Category[];
}

export const ItemsFilterBar: React.FC<ItemsFilterBarProps> = ({
  categoriaID,
  setCategoriaID,
  categorias,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
      <select
        value={categoriaID}
        onChange={(e) => setCategoriaID(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      >
        <option value="">Todas las Categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      {categoriaID && (
        <button
          onClick={() => setCategoriaID('')}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

