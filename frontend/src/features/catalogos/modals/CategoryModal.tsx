import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../core/api/axios.config';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/categorias', { nombre, descripcion });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Categoría" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

