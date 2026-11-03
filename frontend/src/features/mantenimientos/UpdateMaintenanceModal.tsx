import React, { useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { Maintenance } from '../../core/types';
import api from '../../core/api/axios.config';

interface UpdateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mantenimiento: Maintenance;
  onSuccess: () => void;
}

export const UpdateMaintenanceModal: React.FC<UpdateMaintenanceModalProps> = ({
  isOpen,
  onClose,
  mantenimiento,
  onSuccess,
}) => {
  const [estado, setEstado] = useState('completado');
  const [costo, setCosto] = useState<number>(mantenimiento.costo || 0);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/mantenimientos/${mantenimiento.id}/estado`, {
        estado,
        costo: Number(costo),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar Mantenimiento" subtitle={`Activo: ${mantenimiento.activo?.codigo_activo}`} maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nuevo Estado *</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
          >
            <option value="en_proceso">En Proceso</option>
            <option value="completado">Completado (Devolver equipo a Disponible)</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Costo Final ($ USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={costo}
            onChange={(e) => setCosto(Number(e.target.value))}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={updating} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

