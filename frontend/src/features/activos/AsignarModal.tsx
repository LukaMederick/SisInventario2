import React, { useState, useEffect } from 'react';
import { Asset, User } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface AsignarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activo: Asset;
  onSuccess: () => void;
}

export const AsignarModal: React.FC<AsignarModalProps> = ({
  isOpen,
  onClose,
  activo,
  onSuccess,
}) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioID, setUsuarioID] = useState<string>('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/usuarios').then((res) => {
      const list = res.data || [];
      setUsuarios(list);
      if (list.length > 0) setUsuarioID(list[0].id);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioID) {
      setError('Selecciona un usuario o colaborador');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post(`/activos/${activo.id}/asignar`, {
        usuario_destino_id: usuarioID,
        almacen_id: activo.almacen_id,
        notas: notas || 'Asignación de equipo de trabajo',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al asignar equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Activo a Colaborador" subtitle={`Equipo: ${activo.modelo?.nombre} (${activo.codigo_activo})`} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Colaborador / Usuario Destino *</label>
          <select value={usuarioID} onChange={(e) => setUsuarioID(e.target.value)} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre_completo} ({u.email} - {u.rol?.nombre})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notas de Entrega / Responsiva</label>
          <textarea rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. Entregado con cargador, mouse y funda..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {loading ? 'Asignando...' : 'Confirmar Asignación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
