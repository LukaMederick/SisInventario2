import React, { useState, useEffect } from 'react';
import { Asset, Supplier } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';
import { NuevoMantenimientoFields } from './NuevoMantenimientoFields';

interface NuevoMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevoMantenimientoModal: React.FC<NuevoMantenimientoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activos, setActivos] = useState<Asset[]>([]);
  const [proveedores, setProveedores] = useState<Supplier[]>([]);

  const [activoID, setActivoID] = useState<number>(0);
  const [tipo, setTipo] = useState('correctivo');
  const [descripcion, setDescripcion] = useState('');
  const [proveedorID, setProveedorID] = useState<number | ''>('');
  const [costo, setCosto] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [actRes, supRes] = await Promise.all([
          api.get('/activos', { params: { limit: 100 } }),
          api.get('/proveedores'),
        ]);
        const list = actRes.data.data || [];
        setActivos(list);
        setProveedores(supRes.data || []);
        if (list.length > 0) setActivoID(list[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activoID) {
      setError('Selecciona el equipo a ingresar a mantenimiento');
      return;
    }
    setLoading(true);
    setError(null);
    const payload: any = {
      activo_id: Number(activoID),
      tipo,
      descripcion,
      costo: Number(costo),
      fecha_inicio: fechaInicio,
      estado: 'pendiente',
      ...(proveedorID ? { proveedor_id: Number(proveedorID) } : {}),
    };

    try {
      await api.post('/mantenimientos', payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Registro de Mantenimiento"
      subtitle="Envía un activo a servicio técnico preventivo o correctivo"
      maxWidth="md"
    >
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <NuevoMantenimientoFields
          activoID={activoID} setActivoID={setActivoID}
          tipo={tipo} setTipo={setTipo}
          fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
          proveedorID={proveedorID} setProveedorID={setProveedorID}
          costo={costo} setCosto={setCosto}
          descripcion={descripcion} setDescripcion={setDescripcion}
          activos={activos} proveedores={proveedores}
        />
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition disabled:opacity-50">
            {loading ? 'Creando...' : 'Crear Ticket'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
