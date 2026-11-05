import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import api from '../../../core/api/axios.config';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newSupplier?: any) => void;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.post('/proveedores', { nombre, ruc, contacto, telefono, email });
      onSuccess?.(res.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el proveedor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proveedor" maxWidth="md">
      {error && <div className="mb-3 p-2 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Razón Social *</label>
          <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. TechData Perú S.A.C." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">RUC *</label>
            <input type="text" required value={ruc} onChange={(e) => setRuc(e.target.value)} placeholder="20123456789" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto</label>
            <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Nombre del asesor" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+51 987654321" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ventas@proveedor.pe" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar Proveedor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
