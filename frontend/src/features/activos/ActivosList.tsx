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

  // Modales
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/categorias'), api.get('/estados-equipo')]).then(([c, e]) => {
      setCategorias(c.data || []);
      setEstados(e.data || []);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivos();
  }, [page, search, categoriaID, estadoID, selectedWarehouse]);

  const columns = useActivoColumns({
    hasRole,
    onOpenDetail: (a) => { setSelectedAsset(a); setIsDetailOpen(true); },
    onOpenTransfer: (a) => { setSelectedAsset(a); setIsTransferOpen(true); },
    onOpenAssign: (a) => { setSelectedAsset(a); setIsAssignOpen(true); },
    onOpenReturn: (a) => { setSelectedAsset(a); setIsReturnOpen(true); },
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
            <button onClick={() => { setSelectedAsset(null); setIsFormOpen(true); }} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo Activo
            </button>
          )}
        </div>
      </div>

      <ActivosFilterBar
        categorias={categorias} estados={estados} categoriaID={categoriaID} estadoID={estadoID} search={search}
        onCategoriaChange={setCategoriaID} onEstadoChange={setEstadoID} onClear={() => { setCategoriaID(''); setEstadoID(''); setSearch(''); }}
      />

      <DataTable columns={columns} data={activos} isLoading={loading} totalItems={total} currentPage={page} pageSize={15} onPageChange={setPage} searchPlaceholder="Buscar..." onSearchChange={(v) => { setSearch(v); setPage(1); }} />

      {isDetailOpen && selectedAsset && <ActivoDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} activo={selectedAsset} onUpdate={fetchActivos} />}
      {isFormOpen && <ActivoFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchActivos} assetToEdit={selectedAsset} />}
      {isTransferOpen && selectedAsset && <TransferirModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} activo={selectedAsset} onSuccess={fetchActivos} />}
      {isAssignOpen && selectedAsset && <AsignarModal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} activo={selectedAsset} onSuccess={fetchActivos} />}
      {isReturnOpen && selectedAsset && <DevolverModal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} activo={selectedAsset} onSuccess={fetchActivos} />}
    </div>
  );
};
