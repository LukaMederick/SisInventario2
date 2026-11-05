import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Stock, Warehouse } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { AjusteStockModal } from './AjusteStockModal';
import { useStockColumns } from './useStockColumns';

export const StockOverview: React.FC = () => {
  const { selectedWarehouse, hasRole } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [filterAlmacenID, setFilterAlmacenID] = useState<string>(
    selectedWarehouse ? String(selectedWarehouse.id) : ''
  );
  const [selectedStockItem, setSelectedStockItem] = useState<any>(null);
  const [isAjusteOpen, setIsAjusteOpen] = useState(false);

  useEffect(() => {
    api.get('/almacenes').then((res) => setAlmacenes(res.data || [])).catch(console.error);
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const params = { search, ...(filterAlmacenID ? { almacen_id: filterAlmacenID } : {}) };
      const res = await api.get('/stock', { params });
      setStocks(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStocks(); }, [search, filterAlmacenID]);

  const canManage = hasRole('Administrador', 'Encargado de almacén');
  const columns = useStockColumns({
    canManage,
    onOpenAjuste: (row) => {
      if (row.item) {
        setSelectedStockItem({ ...row.item, stocks: [row] });
        setIsAjusteOpen(true);
      }
    },
  });

  const exportHeaders = ['SKU', 'Insumo', 'Almacén', 'Cantidad', 'Stock Mínimo', 'Último Conteo'];
  const exportRows = stocks.map((s) => [
    s.item?.sku || '', s.item?.nombre || '', s.almacen?.nombre || '',
    s.cantidad, s.item?.stock_minimo || 0,
    s.ultimo_conteo ? new Date(s.ultimo_conteo).toLocaleDateString() : '',
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Layers className="w-5 h-5 mr-2 text-emerald-600" />
            Control de Stock por Almacén
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Existencias físicas reales, alertas de stock mínimo y conteos</p>
        </div>
        <ExportButtons title="Stock por Almacén" filename="control_stock" headers={exportHeaders} data={exportRows} />
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <select value={filterAlmacenID} onChange={(e) => setFilterAlmacenID(e.target.value)} className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700">
          <option value="">Todos los Almacenes</option>
          {almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
        </select>
        {filterAlmacenID && (
          <button onClick={() => setFilterAlmacenID('')} className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto">
            Limpiar filtro
          </button>
        )}
      </div>

      <DataTable columns={columns} data={stocks} isLoading={loading} searchPlaceholder="Buscar por SKU o nombre..." onSearchChange={setSearch} />
      {isAjusteOpen && selectedStockItem && (
        <AjusteStockModal isOpen={isAjusteOpen} onClose={() => setIsAjusteOpen(false)} item={selectedStockItem} onSuccess={fetchStocks} />
      )}
    </div>
  );
};
