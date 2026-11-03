import React from 'react';
import { Modal } from '../../shared/components/Modal';
import { AuditLog } from '../../core/types';

interface AuditDiffModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

const formatJSON = (raw?: string) => {
  if (!raw) return '—';
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return JSON.stringify(obj, null, 2);
  } catch {
    return raw;
  }
};

export const AuditDiffModal: React.FC<AuditDiffModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <Modal
      isOpen={!!log}
      onClose={onClose}
      title={`Comparador de Cambios — Tabla ${log.tabla} (ID: ${log.registro_id})`}
      subtitle={`Operación: ${log.accion} por ${log.usuario?.nombre_completo || 'Sistema'} el ${new Date(log.created_at).toLocaleString()}`}
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
            Datos Anteriores (Before)
          </span>
          <pre className="text-[11px] font-mono bg-rose-50/40 border border-rose-100 p-3 rounded-xl overflow-x-auto max-h-96 text-slate-800">
            {formatJSON(log.datos_anteriores)}
          </pre>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Datos Nuevos (After)
          </span>
          <pre className="text-[11px] font-mono bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl overflow-x-auto max-h-96 text-slate-800">
            {formatJSON(log.datos_nuevos)}
          </pre>
        </div>
      </div>
    </Modal>
  );
};

