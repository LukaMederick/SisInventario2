import { useState, useEffect } from 'react';
import { Asset, Item, Warehouse } from '../../core/types';
import api from '../../core/api/axios.config';

export function useRegistrarMovimiento(onSuccess: () => void, onClose: () => void) {
  const [tipo, setTipo] = useState('ajuste');
  const [aplicaA, setAplicaA] = useState<'activo' | 'item'>('activo');
  const [activoID, setActivoID] = useState<string>('');
  const [itemID, setItemID] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [documento, setDocumento] = useState('');
  const [origenID, setOrigenID] = useState<string>('');
  const [destinoID, setDestinoID] = useState<string>('');
  const [motivo, setMotivo] = useState('');

  const [activos, setActivos] = useState<Asset[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/activos', { params: { limit: 100 } }),
      api.get('/items', { params: { limit: 100 } }),
      api.get('/almacenes'),
    ]).then(([actRes, itmRes, almRes]) => {
      const actList = actRes.data.data || [];
      const itmList = itmRes.data.data || [];
      const almList = almRes.data || [];
      setActivos(actList);
      setItems(itmList);
      setAlmacenes(almList);
      if (actList.length > 0) setActivoID(String(actList[0].id));
      if (itmList.length > 0) setItemID(String(itmList[0].id));
      if (almList.length > 0) setOrigenID(String(almList[0].id));
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) { setError('El motivo es obligatorio'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post('/movimientos', {
        tipo, aplica_a: aplicaA,
        activo_id: aplicaA === 'activo' && activoID ? Number(activoID) : undefined,
        item_id: aplicaA === 'item' && itemID ? Number(itemID) : undefined,
        cantidad: Number(cantidad) || 1, documento,
        almacen_origen_id: origenID ? Number(origenID) : undefined,
        almacen_destino_id: destinoID ? Number(destinoID) : undefined,
        motivo,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return {
    tipo, setTipo, aplicaA, setAplicaA, activoID, setActivoID,
    itemID, setItemID, cantidad, setCantidad, documento, setDocumento,
    origenID, setOrigenID, destinoID, setDestinoID, motivo, setMotivo,
    activos, items, almacenes, loading, error, handleSubmit,
  };
}

