import React, { useState, useEffect } from 'react';
import { Asset, Movement, Assignment, Maintenance } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';
import { Info, History, UserCheck, Wrench } from 'lucide-react';
import { ActivoInfoTab } from './tabs/ActivoInfoTab';
import { ActivoMovimientosTab } from './tabs/ActivoMovimientosTab';
import { ActivoAsignacionesTab } from './tabs/ActivoAsignacionesTab';
import { ActivoMantenimientosTab } from './tabs/ActivoMantenimientosTab';

interface ActivoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activo: Asset;
  onUpdate: () => void;
}

export const ActivoDetailModal: React.FC<ActivoDetailModalProps> = ({ isOpen, onClose, activo }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'movimientos' | 'asignaciones' | 'mantenimientos'>('info');
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [asignaciones, setAsignaciones] = useState<Assignment[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Maintenance[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && activo.id) {
      setLoadingHistory(true);
      Promise.all([
        api.get('/movimientos', { params: { activo_id: activo.id } }),
        api.get('/asignaciones', { params: { activo_id: activo.id } }),
        api.get('/mantenimientos', { params: { activo_id: activo.id } }),
      ]).then(([movRes, asigRes, maintRes]) => {
        setMovimientos(movRes.data.data || []);
        setAsignaciones(asigRes.data.data || []);
        setMantenimientos(maintRes.data.data || []);
      }).catch(console.error).finally(() => setLoadingHistory(false));
    }
  }, [isOpen, activo.id]);

  const tabs = [
    { key: 'info', label: 'Información & QR', icon: Info, count: null },
    { key: 'movimientos', label: 'Movimientos', icon: History, count: movimientos.length },
    { key: 'asignaciones', label: 'Asignaciones', icon: UserCheck, count: asignaciones.length },
    { key: 'mantenimientos', label: 'Mantenimientos', icon: Wrench, count: mantenimientos.length },
  ] as const;

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={`${activo.modelo?.nombre || 'Activo'} — ${activo.codigo_activo}`}
      subtitle={`S/N: ${activo.numero_serie}`} maxWidth="4xl"
    >
      <div className="flex border-b border-slate-200 mb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2 text-xs font-semibold border-b-2 transition ${isActive ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {tab.label} {tab.count !== null ? `(${tab.count})` : ''}
            </button>
          );
        })}
      </div>

      {activeTab === 'info' && <ActivoInfoTab activo={activo} />}
      {activeTab === 'movimientos' && <ActivoMovimientosTab movimientos={movimientos} loading={loadingHistory} />}
      {activeTab === 'asignaciones' && <ActivoAsignacionesTab asignaciones={asignaciones} loading={loadingHistory} />}
      {activeTab === 'mantenimientos' && <ActivoMantenimientosTab mantenimientos={mantenimientos} loading={loadingHistory} />}
    </Modal>
  );
};
