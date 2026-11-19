import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { EquipmentState } from '../../../core/types';
import api from '../../../core/api/axios.config';

interface StateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stateToEdit?: EquipmentState | null;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#06b6d4', '#ec4899'];

export const StateModal: React.FC<StateModalProps> = ({
  isOpen, onClose, onSuccess, stateToEdit,
}) => {
  const [nombre, setNombre] = useState(stateToEdit?.nombre || '');
  const [color, setColor] = useState(stateToEdit?.color || '#3b82f6');
  const [descripcion, setDescripcion] = useState(stateToEdit?.descripcion || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stateToEdit) {
      setNombre(stateToEdit.nombre);
      setColor(stateToEdit.color || '#3b82f6');
      setDescripcion(stateToEdit.descripcion || '');
    } else {
      setNombre('');
      setColor('#3b82f6');
      setDescripcion('');
    }
  }, [stateToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (stateToEdit) {
        await api.put(`/estados-equipo/${stateToEdit.id}`, { nombre, color, descripcion });
      } else {
        await api.post('/estados-equipo', { nombre, color, descripcion });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el estado');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={stateToEdit ? 'Editar Estado de Equipo' : 'Nuevo en Estados de Equipo'} maxWidth="md">
      {error && <div className="mb-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Estado *</label>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. En Diagnóstico" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Color (hex) *</label>
            <div className="flex items-center space-x-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white" />
              <input type="text" required value={color} onChange={(e) => setColor(e.target.value)} placeholder="#3b82f6" className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 pt-1">
          <span className="text-[11px] text-slate-400 mr-1">Sugeridos:</span>
          {PRESET_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} className="w-4 h-4 rounded-full border border-white shadow-sm hover:scale-110 transition" style={{ backgroundColor: c }} />
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
          <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describe el propósito o condición de este estado..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancelar</button>
          <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

