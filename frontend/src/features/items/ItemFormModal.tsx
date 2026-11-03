import React, { useState, useEffect } from 'react';
import { Item, Category, Brand } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';
import { ItemFormFields } from './ItemFormFields';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit?: Item | null;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen, onClose, onSuccess, itemToEdit,
}) => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [marcas, setMarcas] = useState<Brand[]>([]);

  const [sku, setSku] = useState(itemToEdit?.sku || '');
  const [nombre, setNombre] = useState(itemToEdit?.nombre || '');
  const [descripcion, setDescripcion] = useState(itemToEdit?.descripcion || '');
  const [categoriaID, setCategoriaID] = useState<number>(itemToEdit?.categoria_id || 0);
  const [marcaID, setMarcaID] = useState<number | ''>(itemToEdit?.marca_id || '');
  const [unidad, setUnidad] = useState(itemToEdit?.unidad || 'unidad');
  const [stockMinimo, setStockMinimo] = useState<number>(itemToEdit?.stock_minimo || 5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get('/categorias'), api.get('/marcas')]).then(([catRes, braRes]) => {
      setCategorias(catRes.data || []);
      setMarcas(braRes.data || []);
      if (!itemToEdit && catRes.data?.length > 0) setCategoriaID(catRes.data[0].id);
    }).catch(console.error);
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload: any = {
      sku, nombre, descripcion, categoria_id: Number(categoriaID),
      unidad, stock_minimo: Number(stockMinimo), activo: true,
      ...(marcaID ? { marca_id: Number(marcaID) } : {}),
    };
    try {
      if (itemToEdit) await api.put(`/items/${itemToEdit.id}`, payload);
      else await api.post('/items', payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar insumo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={itemToEdit ? 'Editar Insumo o Repuesto' : 'Nuevo Insumo en Catálogo'} subtitle="Define código SKU, nombre y stock mínimo" maxWidth="md">
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <ItemFormFields
          sku={sku} setSku={setSku} nombre={nombre} setNombre={setNombre}
          descripcion={descripcion} setDescripcion={setDescripcion}
          categoriaID={categoriaID} setCategoriaID={setCategoriaID}
          marcaID={marcaID} setMarcaID={setMarcaID} unidad={unidad} setUnidad={setUnidad}
          stockMinimo={stockMinimo} setStockMinimo={setStockMinimo}
          categorias={categorias} marcas={marcas}
        />
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50">
            {loading ? 'Guardando...' : itemToEdit ? 'Actualizar Insumo' : 'Crear Insumo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
