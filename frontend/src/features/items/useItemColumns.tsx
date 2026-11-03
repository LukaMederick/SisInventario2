import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Item } from '../../core/types';
import { AlertTriangle, ArrowDownToLine, SlidersHorizontal } from 'lucide-react';

interface UseItemColumnsProps {
  canManage: boolean;
  onOpenEntrada: (item: Item) => void;
  onOpenAjuste: (item: Item) => void;
}

export const useItemColumns = ({
  canManage,
  onOpenEntrada,
  onOpenAjuste,
}: UseItemColumnsProps): Column<Item>[] => {
  return [
    {
      key: 'sku',
      header: 'SKU',
      render: (row) => <span className="font-mono font-bold text-xs text-slate-800">{row.sku}</span>,
    },
    {
      key: 'nombre',
      header: 'Descripción del Insumo',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{row.nombre}</span>
          <p className="text-[11px] text-slate-500 truncate max-w-sm">{row.descripcion || '—'}</p>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría / Marca',
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.categoria?.nombre || '—'} {row.marca?.nombre ? `(${row.marca.nombre})` : ''}
        </span>
      ),
    },
    {
      key: 'unidad',
      header: 'Unidad',
      render: (row) => <span className="capitalize text-xs text-slate-500">{row.unidad}</span>,
    },
    {
      key: 'stock_minimo',
      header: 'Stock Mínimo',
      render: (row) => <span className="font-mono text-xs text-slate-600">{row.stock_minimo}</span>,
    },
    {
      key: 'stock_total',
      header: 'Stock Total',
      render: (row) => {
        const totalStock = (row.stocks || []).reduce((acc, curr) => acc + curr.cantidad, 0);
        const isLow = totalStock <= row.stock_minimo;
        return (
          <span
            className={`font-mono text-xs font-bold inline-flex items-center px-2 py-0.5 rounded-full ${
              isLow ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isLow && <AlertTriangle className="w-3 h-3 mr-1 text-rose-500" />}
            {totalStock} {row.unidad}s
          </span>
        );
      },
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center space-x-1.5">
          {canManage && (
            <>
              <button
                onClick={() => onOpenEntrada(row)}
                title="Registrar Entrada de Stock"
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAjuste(row)}
                title="Ajuste de Conteo / Inventario Físico"
                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
};

