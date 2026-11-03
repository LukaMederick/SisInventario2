import React from 'react';
import { Asset, Supplier } from '../../core/types';

interface NuevoMantenimientoFieldsProps {
  activoID: number;
  setActivoID: (val: number) => void;
  tipo: string;
  setTipo: (val: string) => void;
  fechaInicio: string;
  setFechaInicio: (val: string) => void;
  proveedorID: number | '';
  setProveedorID: (val: number | '') => void;
  costo: number;
  setCosto: (val: number) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
  activos: Asset[];
  proveedores: Supplier[];
}

export const NuevoMantenimientoFields: React.FC<NuevoMantenimientoFieldsProps> = ({
  activoID, setActivoID, tipo, setTipo, fechaInicio, setFechaInicio,
  proveedorID, setProveedorID, costo, setCosto, descripcion, setDescripcion,
  activos, proveedores,
}) => (
  <>
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Equipo / Activo *</label>
      <select value={activoID} onChange={(e) => setActivoID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
        {activos.map((a) => <option key={a.id} value={a.id}>{a.codigo_activo} - {a.modelo?.nombre} ({a.estado?.nombre})</option>)}
      </select>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Servicio *</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
          <option value="preventivo">Preventivo</option>
          <option value="correctivo">Correctivo</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Inicio *</label>
        <input type="date" required value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Taller / Proveedor</label>
        <select value={proveedorID} onChange={(e) => setProveedorID(e.target.value ? Number(e.target.value) : '')} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
          <option value="">Soporte Interno</option>
          {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Costo Estimado ($ USD)</label>
        <input type="number" step="0.01" min="0" value={costo} onChange={(e) => setCosto(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
      </div>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción de la Falla o Trabajo *</label>
      <textarea required rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalla el síntoma o motivo del mantenimiento..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
    </div>
  </>
);
