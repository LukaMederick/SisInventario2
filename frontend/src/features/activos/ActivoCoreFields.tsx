import React from 'react';
import { Model, Warehouse, EquipmentState } from '../../core/types';

interface ActivoCoreFieldsProps {
  codigoActivo: string;
  setCodigoActivo: (val: string) => void;
  numeroSerie: string;
  setNumeroSerie: (val: string) => void;
  modeloID: number;
  setModeloID: (val: number) => void;
  almacenID: number;
  setAlmacenID: (val: number) => void;
  estadoID: number;
  setEstadoID: (val: number) => void;
  modelos: Model[];
  almacenes: Warehouse[];
  estados: EquipmentState[];
}

export const ActivoCoreFields: React.FC<ActivoCoreFieldsProps> = ({
  codigoActivo, setCodigoActivo, numeroSerie, setNumeroSerie,
  modeloID, setModeloID, almacenID, setAlmacenID, estadoID, setEstadoID,
  modelos, almacenes, estados,
}) => (
  <>
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Código de Activo / Placa *</label>
      <input type="text" required value={codigoActivo} onChange={(e) => setCodigoActivo(e.target.value)} placeholder="Ej. ACT-2026-001" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Serie del Fabricante *</label>
      <input type="text" required value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} placeholder="Ej. DELL-LAT-5420-SN001" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo de Equipo *</label>
      <select value={modeloID} onChange={(e) => setModeloID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
        {modelos.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre} ({m.marca?.nombre} - {m.categoria?.nombre})</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén Inicial / Ubicación *</label>
      <select value={almacenID} onChange={(e) => setAlmacenID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
        {almacenes.map((w) => (
          <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Estado Inicial *</label>
      <select value={estadoID} onChange={(e) => setEstadoID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
        {estados.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
      </select>
    </div>
  </>
);
