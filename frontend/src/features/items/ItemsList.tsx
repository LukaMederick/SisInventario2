import React, { useState, useEffect } from 'react';
import { Boxes, Plus } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Item, Category } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { ExportButtons } from '../../shared/components/ExportButtons';
import { ItemFormModal } from './ItemFormModal';
import { EntradaStockModal } from './EntradaStockModal';
import { AjusteStockModal } from './AjusteStockModal';
import { useItemColumns } from './useItemColumns';
import { ItemsFilterBar } from './ItemsFilterBar';

export const ItemsList: React.FC = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [categorias, setCategorias] = useState<Category[]>([]);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEntradaOpen, setIsEntradaOpen] = useState(false);
  const [isAjusteOpen, setIsAjusteOpen] = useState(false);

  useEffect(() => {
    api.get('/categorias').then((res) => setCategorias(res.data || [])).catch(console.error);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15, search, ...(categoriaID ? { categoria_id: categoriaID } : {}) };
      const res = await api.get('/items', { params });
      setItems(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, search, categoriaID]);

  const canManage = hasRole('Administrador', 'Encargado de almacén');
  const columns = useItemColumns({
    canManage,
    onOpenEntrada: (item) => { setSelectedItem(item); setIsEntradaOpen(true); },
    onOpenAjuste: (item) => { setSelectedItem(item); setIsAjusteOpen(true); },
  });

  const exportHeaders = ['SKU', 'Nombre', 'Categoría', 'Marca', 'Unidad', 'Stock Mínimo', 'Stock Total'];
  const exportRows = items.map((i) => [
    i.sku, i.nombre, i.categoria?.nombre || '', i.marca?.nombre || '', i.unidad, i.stock_minimo,
    (i.stocks || []).reduce((acc, c) => acc + c.cantidad, 0),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Boxes className="w-5 h-5 mr-2 text-purple-600" />
            Catálogo de Insumos y Repuestos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Cables, conectores, discos SSD, tóner y accesorios</p>
        </div>
        <div className="flex items-center space-x-2.5">
          <ExportButtons title="Catálogo de Insumos" filename="insumos" headers={exportHeaders} data={exportRows} />
          {canManage && (
            <button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo Insumo
            </button>
          )}
        </div>
      </div>

      <ItemsFilterBar categoriaID={categoriaID} setCategoriaID={setCategoriaID} categorias={categorias} />

      <DataTable
        columns={columns}
        data={items}
        isLoading={loading}
        totalItems={total}
        currentPage={page}
        pageSize={15}
        onPageChange={setPage}
        searchPlaceholder="Buscar por SKU, nombre..."
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
      />

      {isFormOpen && <ItemFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchItems} itemToEdit={selectedItem} />}
      {isEntradaOpen && selectedItem && <EntradaStockModal isOpen={isEntradaOpen} onClose={() => setIsEntradaOpen(false)} item={selectedItem} onSuccess={fetchItems} />}
      {isAjusteOpen && selectedItem && <AjusteStockModal isOpen={isAjusteOpen} onClose={() => setIsAjusteOpen(false)} item={selectedItem} onSuccess={fetchItems} />}
    </div>
  );
};
