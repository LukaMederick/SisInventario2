import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { Role } from '../../core/types';
import api from '../../core/api/axios.config';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onSuccess: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  roles,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rolID, setRolID] = useState<number>(roles[0]?.id || 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/usuarios', {
        email, password, nombre_completo: nombreCompleto, telefono, rol_id: Number(rolID),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Usuario" maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
          <input type="text" required value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña Inicial *</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rol *</label>
            <select value={rolID} onChange={(e) => setRolID(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {saving ? 'Guardando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
