import React from 'react';
import { Filter } from 'lucide-react';
import { Warehouse } from '../../core/types';

interface MovimientosFilterBarProps {
  tipo: string;
  setTipo: (val: string) => void;
  almacenID: string;
  setAlmacenID: (val: string) => void;
  desde: string;
  setDesde: (val: string) => void;
  hasta: string;
  setHasta: (val: string) => void;
  almacenes: Warehouse[];
}

export const MovimientosFilterBar: React.FC<MovimientosFilterBarProps> = ({
  tipo,
  setTipo,
  almacenID,
  setAlmacenID,
  desde,
  setDesde,
  hasta,
  setHasta,
  almacenes,
}) => {
  const hasFilters = Boolean(tipo || almacenID || desde || hasta);

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center text-xs font-semibold text-slate-500">
        <Filter className="w-3.5 h-3.5 mr-1" />
        Filtros:
      </div>

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">Todos los Tipos</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
        <option value="transferencia">Transferencia</option>
        <option value="ajuste">Ajuste</option>
        <option value="asignacion">Asignación</option>
        <option value="devolucion">Devolución</option>
        <option value="baja">Baja</option>
      </select>

      <select
        value={almacenID}
        onChange={(e) => setAlmacenID(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">Todos los Almacenes</option>
        {almacenes.map((w) => (
          <option key={w.id} value={w.id}>
            {w.nombre} ({w.codigo})
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <span>Desde:</span>
        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <span>Hasta:</span>
        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
        />
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setTipo('');
            setAlmacenID('');
            setDesde('');
            setHasta('');
          }}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

