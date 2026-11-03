import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Filter } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Maintenance } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { NuevoMantenimientoModal } from './NuevoMantenimientoModal';
import { UpdateMaintenanceModal } from './UpdateMaintenanceModal';
import { useMaintenanceColumns } from './useMaintenanceColumns';

export const MantenimientosList: React.FC = () => {
  const { hasRole } = useAuth();
  const [mantenimientos, setMantenimientos] = useState<Maintenance[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState('');

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedMaint, setSelectedMaint] = useState<Maintenance | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15, ...(estado ? { estado } : {}) };
      const res = await api.get('/mantenimientos', { params });
      setMantenimientos(res.data.data || []);
      setTotal(res.data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, [page, estado]);

  const canUpdate = hasRole('Administrador', 'Encargado de almacén', 'Técnico');
  const columns = useMaintenanceColumns({
    canUpdate,
    onUpdate: (m) => { setSelectedMaint(m); setIsUpdateOpen(true); },
  });

  const exportHeaders = ['Activo', 'Tipo', 'Descripción', 'Costo', 'Estado'];
  const exportRows = mantenimientos.map((m) => [m.activo?.codigo_activo || '', m.tipo, m.descripcion, m.costo, m.estado]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Wrench className="w-5 h-5 mr-2 text-amber-600" />
            Control de Mantenimientos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de reparaciones preventivas y correctivas</p>
        </div>
        <div className="flex items-center space-x-2">
          <ExportButtons title="Mantenimientos" filename="mantenimientos" headers={exportHeaders} data={exportRows} />
          {canUpdate && (
            <button onClick={() => setIsNewOpen(true)} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo Ticket
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700">
          <option value="">Todos los tickets</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <DataTable columns={columns} data={mantenimientos} isLoading={loading} totalItems={total} currentPage={page} pageSize={15} onPageChange={setPage} />

      {isNewOpen && <NuevoMantenimientoModal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} onSuccess={fetchMaintenances} />}
      {isUpdateOpen && selectedMaint && (
        <UpdateMaintenanceModal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} maintenance={selectedMaint} onSuccess={fetchMaintenances} />
      )}
    </div>
  );
};
