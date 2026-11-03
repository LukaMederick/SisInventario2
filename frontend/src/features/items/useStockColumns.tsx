import React from 'react';
import { Column } from '../../shared/components/DataTable';
import { Stock } from '../../core/types';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';

interface UseStockColumnsProps {
  canManage: boolean;
  onOpenAjuste: (stock: Stock) => void;
}

export const useStockColumns = ({
  canManage,
  onOpenAjuste,
}: UseStockColumnsProps): Column<Stock>[] => {
  return [
    {
      key: 'item_sku',
      header: 'SKU',
      render: (row) => <span className="font-mono font-bold text-xs text-slate-800">{row.item?.sku}</span>,
    },
    {
      key: 'item_nombre',
      header: 'Insumo / Descripción',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{row.item?.nombre}</span>
          <p className="text-[11px] text-slate-500">
            {row.item?.categoria?.nombre} • {row.item?.marca?.nombre || 'Genérico'}
          </p>
        </div>
      ),
    },
    {
      key: 'almacen',
      header: 'Almacén',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.almacen?.nombre} ({row.almacen?.codigo})
        </span>
      ),
    },
    {
      key: 'cantidad',
      header: 'Cantidad Disponible',
      render: (row) => {
        const isCritical = row.cantidad <= (row.item?.stock_minimo || 0);
        return (
          <span
            className={`font-mono font-bold text-xs inline-flex items-center px-2.5 py-1 rounded-full ${
              isCritical
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isCritical && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-500" />}
            {row.cantidad} {row.item?.unidad}s
          </span>
        );
      },
    },
    {
      key: 'stock_minimo',
      header: 'Stock Mínimo',
      render: (row) => (
        <span className="font-mono text-xs text-slate-500">
          {row.item?.stock_minimo} {row.item?.unidad}s
        </span>
      ),
    },
    {
      key: 'ultimo_conteo',
      header: 'Último Conteo',
      render: (row) => (
        <span className="text-xs text-slate-400">
          {row.ultimo_conteo ? new Date(row.ultimo_conteo).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) =>
        canManage && (
          <button
            onClick={() => onOpenAjuste(row)}
            title="Ajustar Conteo"
            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        ),
    },
  ];
};

