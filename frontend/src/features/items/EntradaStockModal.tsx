import React, { useState, useEffect } from 'react';
import { Item, Warehouse } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface EntradaStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onSuccess: () => void;
}

export const EntradaStockModal: React.FC<EntradaStockModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [almacenID, setAlmacenID] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [documento, setDocumento] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/almacenes').then((res) => {
      setAlmacenes(res.data || []);
      if (res.data?.length > 0) setAlmacenID(res.data[0].id);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cantidad <= 0) {
      setError('La cantidad a ingresar debe ser mayor a 0');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/stock/entrada', {
        item_id: item.id,
        almacen_id: Number(almacenID),
        cantidad: Number(cantidad),
        documento,
        motivo: motivo || 'Entrada regular de insumos al almacén',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Entrada de Inventario" subtitle={`Insumo: ${item.nombre} (SKU: ${item.sku})`} maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén Destino *</label>
          <select value={almacenID} onChange={(e) => setAlmacenID(Number(e.target.value))} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
            {almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad ({item.unidad}s) *</label>
            <input type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">N° Guía / Factura</label>
            <input type="text" placeholder="F001-00234..." value={documento} onChange={(e) => setDocumento(e.target.value)} className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo / Notas</label>
          <input type="text" placeholder="Compra periódica..." value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Entrada'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
