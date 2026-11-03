import React, { useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import { TablePagination } from './TablePagination';
import { Column, DataTableProps } from './DataTable.types';

export type { Column, DataTableProps };

export function DataTable<T extends { id?: number | string }>({
  columns, data, searchPlaceholder = 'Buscar registros...',
  onSearchChange, isLoading = false, totalItems,
  currentPage = 1, pageSize = 10, onPageChange, actionButton,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const filteredData = onSearchChange
    ? data
    : data.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(localSearch.toLowerCase())));

  const total = totalItems !== undefined ? totalItems : filteredData.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const displayData = onSearchChange
    ? filteredData
    : filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={localSearch} onChange={handleSearch} placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>
        {actionButton && <div className="flex items-center gap-2">{actionButton}</div>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>{columns.map((col) => <th key={col.key} className="px-5 py-3.5">{col.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
                <p className="mt-2 text-xs">Cargando registros...</p>
              </td></tr>
            ) : displayData.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                <Inbox className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="mt-2 font-medium text-slate-600">No se encontraron registros</p>
              </td></tr>
            ) : (
              displayData.map((row, idx) => (
                <tr key={row.id !== undefined ? String(row.id) : idx} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5 whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination currentPage={currentPage} totalPages={totalPages} total={total} onPageChange={onPageChange} />
    </div>
  );
}
