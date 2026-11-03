import React from 'react';
import { Category, Brand } from '../../core/types';

interface ItemFormFieldsProps {
  sku: string;
  setSku: (val: string) => void;
  nombre: string;
  setNombre: (val: string) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
  categoriaID: number;
  setCategoriaID: (val: number) => void;
  marcaID: number | '';
  setMarcaID: (val: number | '') => void;
  unidad: string;
  setUnidad: (val: string) => void;
  stockMinimo: number;
  setStockMinimo: (val: number) => void;
  categorias: Category[];
  marcas: Brand[];
}

export const ItemFormFields: React.FC<ItemFormFieldsProps> = ({
  sku, setSku, nombre, setNombre, descripcion, setDescripcion,
  categoriaID, setCategoriaID, marcaID, setMarcaID,
  unidad, setUnidad, stockMinimo, setStockMinimo, categorias, marcas,
}) => (
  <>
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Código SKU *</label>
      <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ej. INS-CAB-CAT6-01" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre / Descripción Comercial *</label>
      <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Bobina de Cable UTP Cat6 305m" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría *</label>
        <select value={categoriaID} onChange={(e) => setCategoriaID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Marca</label>
        <select value={marcaID} onChange={(e) => setMarcaID(e.target.value ? Number(e.target.value) : '')} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
          <option value="">Generico / Sin marca</option>
          {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Unidad de Medida</label>
        <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
          <option value="unidad">Unidad</option>
          <option value="caja">Caja</option>
          <option value="bolsa">Bolsa</option>
          <option value="bobina">Bobina</option>
          <option value="metro">Metro</option>
          <option value="par">Par</option>
          <option value="pack">Pack</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Mínimo (Alerta)</label>
        <input type="number" min="0" value={stockMinimo} onChange={(e) => setStockMinimo(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
      </div>
    </div>

    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle Técnico / Observaciones</label>
      <textarea rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Especificaciones o compatibilidad..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
    </div>
  </>
);
