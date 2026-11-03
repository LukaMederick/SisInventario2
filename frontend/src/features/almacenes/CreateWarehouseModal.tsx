import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { User } from '../../core/types';
import api from '../../core/api/axios.config';

interface CreateWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuarios: User[];
}

export const CreateWarehouseModal: React.FC<CreateWarehouseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  usuarios,
}) => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [responsableID, setResponsableID] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: any = { codigo, nombre, direccion, ciudad, telefono, activo: true };
    if (responsableID) payload.responsable_id = responsableID;

    try {
      await api.post('/almacenes', payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear almacén');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Almacén" subtitle="Agrega una nueva sede o centro de almacenamiento" maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleCreate} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Código *</label>
            <input type="text" required placeholder="Ej. ALM-02" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad *</label>
            <input type="text" required placeholder="Ej. Arequipa" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Almacén *</label>
          <input type="text" required placeholder="Ej. Almacén Sucursal Norte" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Física</label>
          <input type="text" placeholder="Av. Industrial 450..." value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
            <input type="text" placeholder="01-555-8888" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable</label>
            <select value={responsableID} onChange={(e) => setResponsableID(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              <option value="">Sin responsable</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombre_completo}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {saving ? 'Guardando...' : 'Crear Almacén'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

