import React from 'react';
import { Filter } from 'lucide-react';

interface AuditoriaFilterBarProps {
  tabla: string;
  setTabla: (val: string) => void;
  accion: string;
  setAccion: (val: string) => void;
  desde: string;
  setDesde: (val: string) => void;
  hasta: string;
  setHasta: (val: string) => void;
}

export const AuditoriaFilterBar: React.FC<AuditoriaFilterBarProps> = ({
  tabla,
  setTabla,
  accion,
  setAccion,
  desde,
  setDesde,
  hasta,
  setHasta,
}) => {
  const hasFilters = Boolean(tabla || accion || desde || hasta);

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center text-xs font-semibold text-slate-500">
        <Filter className="w-3.5 h-3.5 mr-1" />
        Filtrar:
      </div>

      <select
        value={tabla}
        onChange={(e) => setTabla(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">Todas las tablas</option>
        <option value="activos">activos</option>
        <option value="stock">stock</option>
        <option value="items">items</option>
        <option value="movimientos">movimientos</option>
        <option value="asignaciones">asignaciones</option>
        <option value="mantenimientos">mantenimientos</option>
        <option value="usuarios">usuarios</option>
      </select>

      <select
        value={accion}
        onChange={(e) => setAccion(e.target.value)}
        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <option value="">Todas las acciones</option>
        <option value="INSERT">INSERT</option>
        <option value="UPDATE">UPDATE</option>
        <option value="DELETE">DELETE</option>
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
            setTabla('');
            setAccion('');
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

