import React, { useState, useEffect } from 'react';
import { Asset, EquipmentState } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface DevolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  activo: Asset;
  onSuccess: () => void;
}

export const DevolverModal: React.FC<DevolverModalProps> = ({
  isOpen,
  onClose,
  activo,
  onSuccess,
}) => {
  const [estados, setEstados] = useState<EquipmentState[]>([]);
  const [estadoID, setEstadoID] = useState<number>(1);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/estados-equipo').then((res) => {
      const list = (res.data || []).filter((e: EquipmentState) => e.nombre !== 'Asignado');
      setEstados(list);
      const disp = list.find((e: EquipmentState) => e.nombre === 'Disponible');
      if (disp) setEstadoID(disp.id);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/activos/${activo.id}/devolver`, {
        estado_equipo_id: Number(estadoID),
        almacen_id: activo.almacen_id,
        notas: notas || 'Devolución de equipo al almacén',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al devolver equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Devolución de Equipo" subtitle={`Equipo: ${activo.modelo?.nombre} (${activo.codigo_activo})`} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <span className="text-slate-400 block mb-0.5">Actualmente asignado a:</span>
          <span className="font-semibold text-slate-800">{activo.usuario_asignado?.nombre_completo || 'Usuario no identificado'}</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Estado de Reingreso *</label>
          <select value={estadoID} onChange={(e) => setEstadoID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            {estados.map((e) => <option key={e.id} value={e.id}>{e.nombre} - {e.descripcion}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Observaciones / Estado Físico</label>
          <textarea rows={2} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Ej. Equipo devuelto en buen estado con cargador..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {loading ? 'Devolviendo...' : 'Procesar Devolución'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
