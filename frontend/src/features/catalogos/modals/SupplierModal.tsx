import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../core/api/axios.config';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/proveedores', { nombre, ruc, contacto, telefono, email });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proveedor" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Razón Social *</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">RUC</label>
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto</label>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

