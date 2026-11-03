import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  isLoading?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  actionButton?: React.ReactNode;
}

