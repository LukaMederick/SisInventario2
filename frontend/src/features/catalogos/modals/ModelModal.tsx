import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Brand, Category } from '../../../core/types';
import api from '../../../core/api/axios.config';

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  marcas: Brand[];
  categorias: Category[];
  onSuccess: () => void;
}

export const ModelModal: React.FC<ModelModalProps> = ({
  isOpen,
  onClose,
  marcas,
  categorias,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState('');
  const [marcaID, setMarcaID] = useState<number>(marcas[0]?.id || 0);
  const [categoriaID, setCategoriaID] = useState<number>(categorias[0]?.id || 0);
  const [specs, setSpecs] = useState('{}');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/modelos', {
        nombre,
        marca_id: Number(marcaID),
        categoria_id: Number(categoriaID),
        especificaciones: specs,
        activo: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Modelo de Hardware" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Modelo *</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. ThinkPad X1 Carbon" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
            <select value={marcaID} onChange={(e) => setMarcaID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría *</label>
            <select value={categoriaID} onChange={(e) => setCategoriaID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Especificaciones (JSON)</label>
          <textarea rows={2} value={specs} onChange={(e) => setSpecs(e.target.value)} className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};
