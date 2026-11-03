import React from 'react';
import { Supplier } from '../../core/types';

interface ActivoDetailsFieldsProps {
  proveedorID: number | '';
  setProveedorID: (val: number | '') => void;
  precio: number;
  setPrecio: (val: number) => void;
  condicion: string;
  setCondicion: (val: string) => void;
  ubicacionDetalle: string;
  setUbicacionDetalle: (val: string) => void;
  notas: string;
  setNotas: (val: string) => void;
  proveedores: Supplier[];
}

export const ActivoDetailsFields: React.FC<ActivoDetailsFieldsProps> = ({
  proveedorID,
  setProveedorID,
  precio,
  setPrecio,
  condicion,
  setCondicion,
  ubicacionDetalle,
  setUbicacionDetalle,
  notas,
  setNotas,
  proveedores,
}) => {
  return (
    <>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Proveedor / Adquisición
        </label>
        <select
          value={proveedorID}
          onChange={(e) => setProveedorID(e.target.value ? Number(e.target.value) : '')}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Ninguno / Stock inicial</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.ruc})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Precio de Compra ($ USD)
        </label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Condición
        </label>
        <select
          value={condicion}
          onChange={(e) => setCondicion(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Detalle de Ubicación Interna
        </label>
        <input
          type="text"
          value={ubicacionDetalle}
          onChange={(e) => setUbicacionDetalle(e.target.value)}
          placeholder="Ej. Rack B - Bandeja 3, Piso 2 TI"
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Notas u Observaciones
        </label>
        <textarea
          rows={2}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Información adicional del activo..."
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
    </>
  );
};

