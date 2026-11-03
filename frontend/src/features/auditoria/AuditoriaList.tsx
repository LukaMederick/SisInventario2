import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import api from '../../core/api/axios.config';
import { AuditLog } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { AuditDiffModal } from './AuditDiffModal';
import { useAuditColumns } from './useAuditColumns';
import { AuditoriaFilterBar } from './AuditoriaFilterBar';

export const AuditoriaList: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [tabla, setTabla] = useState('');
  const [accion, setAccion] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20, ...(tabla ? { tabla } : {}), ...(accion ? { accion } : {}), ...(desde ? { desde } : {}), ...(hasta ? { hasta } : {}) };
      const res = await api.get('/auditoria', { params });
      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, tabla, accion, desde, hasta]);

  const columns = useAuditColumns((log) => setSelectedLog(log));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
          Visor de Auditoría y Diffs
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Trazabilidad de cambios, inserciones y eliminaciones</p>
      </div>

      <AuditoriaFilterBar
        tabla={tabla}
        setTabla={setTabla}
        accion={accion}
        setAccion={setAccion}
        desde={desde}
        setDesde={setDesde}
        hasta={hasta}
        setHasta={setHasta}
      />

      <DataTable columns={columns} data={logs} isLoading={loading} totalItems={total} currentPage={page} pageSize={20} onPageChange={setPage} />

      <AuditDiffModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};
