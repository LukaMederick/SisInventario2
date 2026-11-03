import React, { useState, useEffect } from 'react';
import { UserCheck, Filter } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Assignment } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { DevolverModal } from '../activos/DevolverModal';
import { useAsignacionColumns } from './useAsignacionColumns';

export const AsignacionesList: React.FC = () => {
  const { hasRole } = useAuth();
  const [asignaciones, setAsignaciones] = useState<Assignment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState('activa');

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15, ...(estado ? { estado } : {}) };
      const res = await api.get('/asignaciones', { params });
      setAsignaciones(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [page, estado]);

  const canReturn = hasRole('Administrador', 'Encargado de almacén', 'Técnico');
  const columns = useAsignacionColumns({
    canReturn,
    onReturn: (row) => {
      if (row.activo) {
        setSelectedAsset({ ...row.activo, usuario_asignado: row.usuario });
        setIsReturnOpen(true);
      }
    },
  });

  const exportHeaders = ['Activo', 'Serie', 'Colaborador', 'Almacén', 'Fecha Asignación', 'Fecha Devolución', 'Estado'];
  const exportRows = asignaciones.map((a) => [
    a.activo?.codigo_activo || '',
    a.activo?.numero_serie || '',
    a.usuario?.nombre_completo || '',
    a.almacen?.nombre || '',
    new Date(a.fecha_asignacion).toLocaleDateString(),
    a.fecha_devolucion ? new Date(a.fecha_devolucion).toLocaleDateString() : '',
    a.estado,
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-indigo-600" />
            Asignaciones a Colaboradores
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Control de equipos en custodia de colaboradores y responsivas</p>
        </div>
        <ExportButtons title="Asignaciones de Equipos" filename="asignaciones" headers={exportHeaders} data={exportRows} />
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="flex items-center text-xs font-semibold text-slate-500">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Filtrar por:
        </div>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">Todas las asignaciones</option>
          <option value="activa">Solo Activas (en uso)</option>
          <option value="devuelta">Devueltas / Históricas</option>
        </select>
      </div>

      <DataTable columns={columns} data={asignaciones} isLoading={loading} totalItems={total} currentPage={page} pageSize={15} onPageChange={setPage} />

      {isReturnOpen && selectedAsset && (
        <DevolverModal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} activo={selectedAsset} onSuccess={fetchAssignments} />
      )}
    </div>
  );
};
