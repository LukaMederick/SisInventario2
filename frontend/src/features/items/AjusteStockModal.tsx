import React, { useState, useEffect } from 'react';
import { Item, Warehouse } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface AjusteStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onSuccess: () => void;
}

export const AjusteStockModal: React.FC<AjusteStockModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [almacenID, setAlmacenID] = useState<number>(0);
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(0);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/almacenes').then((res) => {
      setAlmacenes(res.data || []);
      if (res.data?.length > 0) {
        const firstWh = res.data[0].id;
        setAlmacenID(firstWh);
        const existing = (item.stocks || []).find((s) => s.almacen_id === firstWh);
        if (existing) setNuevaCantidad(existing.cantidad);
      }
    }).catch(console.error);
  }, [item]);

  const handleAlmacenChange = (whID: number) => {
    setAlmacenID(whID);
    const existing = (item.stocks || []).find((s) => s.almacen_id === whID);
    setNuevaCantidad(existing ? existing.cantidad : 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaCantidad < 0 || !motivo) {
      setError(nuevaCantidad < 0 ? 'La cantidad no puede ser negativa' : 'Especifica el motivo del ajuste');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/stock/ajustar', {
        item_id: item.id,
        almacen_id: Number(almacenID),
        nueva_cantidad: Number(nuevaCantidad),
        motivo,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al ajustar stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajuste de Conteo Físico de Stock" subtitle={`Insumo: ${item.nombre} (SKU: ${item.sku})`} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén a Ajustar *</label>
          <select value={almacenID} onChange={(e) => handleAlmacenChange(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            {almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Cantidad Real en Físico ({item.unidad}s) *</label>
          <input type="number" min="0" required value={nuevaCantidad} onChange={(e) => setNuevaCantidad(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo / Justificación *</label>
          <textarea required rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej. Conteo cíclico mensual..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-xl disabled:opacity-50">
            {loading ? 'Ajustando...' : 'Aplicar Ajuste de Stock'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
