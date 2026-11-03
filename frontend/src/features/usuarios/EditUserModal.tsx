import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { User, Role } from '../../core/types';
import api from '../../core/api/axios.config';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  roles: Role[];
  onSuccess: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onSuccess,
}) => {
  const [nombreCompleto, setNombreCompleto] = useState(user.nombre_completo);
  const [telefono, setTelefono] = useState(user.telefono || '');
  const [rolID, setRolID] = useState<number>(user.rol_id);
  const [password, setPassword] = useState('');
  const [activo, setActivo] = useState(user.activo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: any = { nombre_completo: nombreCompleto, telefono, rol_id: Number(rolID), activo, ...(password ? { password } : {}) };
    try {
      await api.put(`/usuarios/${user.id}`, payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario" subtitle={user.nombre_completo} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
          <input type="text" required value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Contraseña (opcional)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex items-center space-x-2 pt-1">
          <input type="checkbox" id="activoEdit" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
          <label htmlFor="activoEdit" className="text-xs font-semibold text-slate-700">Cuenta de usuario activa</label>
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
