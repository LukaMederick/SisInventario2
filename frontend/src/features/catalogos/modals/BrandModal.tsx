import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../core/api/axios.config';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/marcas', { nombre });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Marca" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Marca *</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Asus, TP-Link, Samsung"
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

