import { useState, useEffect } from 'react';
import { Asset, Model, Warehouse, Supplier, EquipmentState } from '../../core/types';
import api from '../../core/api/axios.config';

export function useActivoForm(assetToEdit?: Asset | null, onSuccess?: () => void, onClose?: () => void) {
  const [modelos, setModelos] = useState<Model[]>([]);
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [proveedores, setProveedores] = useState<Supplier[]>([]);
  const [estados, setEstados] = useState<EquipmentState[]>([]);

  const [codigoActivo, setCodigoActivo] = useState(assetToEdit?.codigo_activo || '');
  const [numeroSerie, setNumeroSerie] = useState(assetToEdit?.numero_serie || '');
  const [modeloID, setModeloID] = useState<number>(assetToEdit?.modelo_id || 0);
  const [almacenID, setAlmacenID] = useState<number>(assetToEdit?.almacen_id || 0);
  const [estadoID, setEstadoID] = useState<number>(assetToEdit?.estado_id || 1);
  const [proveedorID, setProveedorID] = useState<number | ''>(assetToEdit?.proveedor_id || '');
  const [precio, setPrecio] = useState<number>(assetToEdit?.precio || 0);
  const [condicion, setCondicion] = useState(assetToEdit?.condicion || 'nuevo');
  const [ubicacionDetalle, setUbicacionDetalle] = useState(assetToEdit?.ubicacion_detalle || '');
  const [notas, setNotas] = useState(assetToEdit?.notas || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProveedores = async (newID?: number) => {
    try {
      const res = await api.get('/proveedores');
      const list = res.data || [];
      setProveedores(list);
      if (newID) setProveedorID(newID);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    Promise.all([
      api.get('/modelos'), api.get('/almacenes'),
      api.get('/proveedores'), api.get('/estados-equipo'),
    ]).then(([modRes, almRes, supRes, estRes]) => {
      setModelos(modRes.data || []);
      setAlmacenes(almRes.data || []);
      setProveedores(supRes.data || []);
      setEstados(estRes.data || []);
      if (!assetToEdit) {
        if (almRes.data?.length > 0) setAlmacenID(almRes.data[0].id);
        if (modRes.data?.length > 0) setModeloID(modRes.data[0].id);
        if (estRes.data?.length > 0) setEstadoID(estRes.data[0].id);
      }
    }).catch(console.error);
  }, [assetToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload: any = {
      codigo_activo: codigoActivo, numero_serie: numeroSerie,
      modelo_id: Number(modeloID), almacen_id: Number(almacenID),
      estado_id: Number(estadoID), precio: Number(precio),
      condicion, ubicacion_detalle: ubicacionDetalle, notas, activo: true,
      ...(proveedorID ? { proveedor_id: Number(proveedorID) } : {}),
    };
    try {
      if (assetToEdit) await api.put(`/activos/${assetToEdit.id}`, payload);
      else await api.post('/activos', payload);
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar activo');
    } finally {
      setLoading(false);
    }
  };

  return {
    modelos, almacenes, proveedores, estados, refreshProveedores,
    codigoActivo, setCodigoActivo, numeroSerie, setNumeroSerie,
    modeloID, setModeloID, almacenID, setAlmacenID, estadoID, setEstadoID,
    proveedorID, setProveedorID, precio, setPrecio,
    condicion, setCondicion, ubicacionDetalle, setUbicacionDetalle,
    notas, setNotas, loading, error, handleSubmit,
  };
}
