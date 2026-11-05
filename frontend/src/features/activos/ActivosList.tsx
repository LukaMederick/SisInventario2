import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Laptop } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Asset, Category, EquipmentState } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { ActivosFilterBar } from './ActivosFilterBar';
import { useActivoColumns } from './useActivoColumns';
import { ActivoDetailModal } from './ActivoDetailModal';
import { ActivoFormModal } from './ActivoFormModal';
import { TransferirModal } from './TransferirModal';
import { AsignarModal } from './AsignarModal';
import { DevolverModal } from './DevolverModal';

export const ActivosList: React.FC = () => {
  const { selectedWarehouse, hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [activos, setActivos] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoriaID, setCategoriaID] = useState('');
  const [estadoID, setEstadoID] = useState('');
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [estados, setEstados] = useState<EquipmentState[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeModal, setActiveModal] = useState<'detail' | 'form' | 'transfer' | 'assign' | 'return' | null>(null);

  useEffect(() => {
    Promise.all([api.get('/categorias'), api.get('/estados-equipo')]).then(([c, e]) => {
      setCategorias(c.data || []); setEstados(e.data || []);
    });
  }, []);

  const fetchActivos = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15, search };
      if (selectedWarehouse) params.almacen_id = selectedWarehouse.id;
      if (categoriaID) params.categoria_id = categoriaID;
      if (estadoID) params.estado_id = estadoID;
      const res = await api.get('/activos', { params });
      setActivos(res.data.data || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchActivos(); }, [page, search, categoriaID, estadoID, selectedWarehouse]);

  const openModal = (type: any, a: Asset | null = null) => { setSelectedAsset(a); setActiveModal(type); };
  const columns = useActivoColumns({
    hasRole,
    onOpenDetail: (a) => openModal('detail', a),
    onOpenTransfer: (a) => openModal('transfer', a),
    onOpenAssign: (a) => openModal('assign', a),
    onOpenReturn: (a) => openModal('return', a),
  });

  const exportHeaders = ['Código', 'Serie', 'Modelo', 'Almacén', 'Estado', 'Precio'];
  const exportRows = activos.map((a) => [a.codigo_activo, a.numero_serie, a.modelo?.nombre || '', a.almacen?.nombre || '', a.estado?.nombre || '', a.precio || 0]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Laptop className="w-5 h-5 mr-2 text-emerald-600" />
            Activos Informáticos y Periféricos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Control de equipos serializados, garantías y ubicaciones</p>
        </div>
        <div className="flex items-center space-x-2.5">
          <ExportButtons title="Activos" filename="activos" headers={exportHeaders} data={exportRows} />
          {hasRole('Administrador', 'Encargado de almacén', 'Técnico') && (
            <button onClick={() => openModal('form', null)} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Nuevo Activo
            </button>
          )}
        </div>
      </div>

      <ActivosFilterBar
        categorias={categorias} estados={estados} categoriaID={categoriaID} estadoID={estadoID} search={search}
        onCategoriaChange={setCategoriaID} onEstadoChange={setEstadoID} onClear={() => { setCategoriaID(''); setEstadoID(''); setSearch(''); }}
      />
      <DataTable columns={columns} data={activos} isLoading={loading} totalItems={total} currentPage={page} pageSize={15} onPageChange={setPage} searchPlaceholder="Buscar..." onSearchChange={(v) => { setSearch(v); setPage(1); }} />

      {activeModal === 'detail' && selectedAsset && <ActivoDetailModal isOpen onClose={() => setActiveModal(null)} activo={selectedAsset} onUpdate={fetchActivos} />}
      {activeModal === 'form' && <ActivoFormModal isOpen onClose={() => setActiveModal(null)} onSuccess={fetchActivos} assetToEdit={selectedAsset} />}
      {activeModal === 'transfer' && selectedAsset && <TransferirModal isOpen onClose={() => setActiveModal(null)} activo={selectedAsset} onSuccess={fetchActivos} />}
      {activeModal === 'assign' && selectedAsset && <AsignarModal isOpen onClose={() => setActiveModal(null)} activo={selectedAsset} onSuccess={fetchActivos} />}
      {activeModal === 'return' && selectedAsset && <DevolverModal isOpen onClose={() => setActiveModal(null)} activo={selectedAsset} onSuccess={fetchActivos} />}
    </div>
  );
};
