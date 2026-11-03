import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange?: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  total,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-5 py-3.5 flex items-center justify-between border-t border-slate-100 bg-slate-50/30 text-xs text-slate-500">
      <span>
        Página <strong className="text-slate-800">{currentPage}</strong> de{' '}
        <strong className="text-slate-800">{totalPages}</strong> ({total} registros)
      </span>
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

