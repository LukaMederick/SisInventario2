import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Asset, Warehouse } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface TransferirModalProps {
  isOpen: boolean;
  onClose: () => void;
  activo: Asset;
  onSuccess: () => void;
}

export const TransferirModal: React.FC<TransferirModalProps> = ({
  isOpen,
  onClose,
  activo,
  onSuccess,
}) => {
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [destinoID, setDestinoID] = useState<number>(0);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/almacenes').then((res) => {
      const available = (res.data || []).filter((w: Warehouse) => w.id !== activo.almacen_id);
      setAlmacenes(available);
      if (available.length > 0) setDestinoID(available[0].id);
    }).catch(console.error);
  }, [activo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinoID) { setError('Selecciona el almacén de destino'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post(`/activos/${activo.id}/transferir`, {
        almacen_origen_id: activo.almacen_id,
        almacen_destino_id: Number(destinoID),
        motivo: motivo || 'Transferencia entre almacenes',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al transferir activo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transferir Activo entre Almacenes" subtitle={`Equipo: ${activo.modelo?.nombre} (${activo.codigo_activo})`} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <div><span className="text-slate-400 block">Almacén Origen:</span><span className="font-semibold text-slate-800">{activo.almacen?.nombre}</span></div>
          <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
          <div className="text-right"><span className="text-slate-400 block">Estado:</span><span className="font-semibold text-slate-800">{activo.estado?.nombre}</span></div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén Destino *</label>
          <select value={destinoID} onChange={(e) => setDestinoID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            {almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo de la Transferencia</label>
          <textarea rows={2} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej. Reubicación por solicitud de sede..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {loading ? 'Transfiriendo...' : 'Confirmar Transferencia'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
