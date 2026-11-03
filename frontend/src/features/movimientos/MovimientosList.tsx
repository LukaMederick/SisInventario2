import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Movement, Warehouse } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { useMovimientoColumns } from './useMovimientoColumns';
import { MovimientosFilterBar } from './MovimientosFilterBar';

export const MovimientosList: React.FC = () => {
  const { selectedWarehouse } = useAuth();
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [tipo, setTipo] = useState('');
  const [almacenID, setAlmacenID] = useState<string>(selectedWarehouse ? String(selectedWarehouse.id) : '');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);

  useEffect(() => {
    api.get('/almacenes').then((res) => setAlmacenes(res.data || [])).catch(console.error);
  }, []);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, ...(tipo ? { tipo } : {}), ...(almacenID ? { almacen_id: almacenID } : {}), ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) };
      const res = await api.get('/movimientos', { params });
      setMovimientos(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [page, tipo, almacenID, desde, hasta]);

  const columns = useMovimientoColumns();

  const exportHeaders = ['Tipo', 'Elemento', 'Cantidad', 'Origen', 'Destino', 'Motivo', 'Documento', 'Fecha'];
  const exportRows = movimientos.map((m) => [
    m.tipo,
    m.activo ? m.activo.codigo_activo : m.item ? m.item.nombre : '',
    m.cantidad,
    m.almacen_origen?.nombre || '',
    m.almacen_destino?.nombre || (m.usuario_destino?.nombre_completo || ''),
    m.motivo || '',
    m.documento || '',
    new Date(m.fecha).toLocaleString(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <ArrowLeftRight className="w-5 h-5 mr-2 text-blue-600" />
            Bitácora de Movimientos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Registro cronológico de entradas, salidas y transferencias</p>
        </div>
        <ExportButtons title="Bitácora de Movimientos" filename="movimientos" headers={exportHeaders} data={exportRows} />
      </div>

      <MovimientosFilterBar
        tipo={tipo}
        setTipo={setTipo}
        almacenID={almacenID}
        setAlmacenID={setAlmacenID}
        desde={desde}
        setDesde={setDesde}
        hasta={hasta}
        setHasta={setHasta}
        almacenes={almacenes}
      />

      <DataTable columns={columns} data={movimientos} isLoading={loading} totalItems={total} currentPage={page} pageSize={20} onPageChange={setPage} />
    </div>
  );
};
