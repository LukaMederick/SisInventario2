import { useState, useCallback, useEffect } from 'react';
import { BaseApiService } from '../../core/services/BaseApiService';

export interface CrudState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useGenericCrud<T extends { id?: number | string }>(
  service: BaseApiService<T>,
  autoFetch = true,
  params?: any
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (customParams?: any) => {
    setLoading(true);
    setError(null);
    try {
      const items = await service.getAll(customParams || params);
      setData(items);
      return items;
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Error al obtener registros');
      return [];
    } finally {
      setLoading(false);
    }
  }, [service, params]);

  const createItem = useCallback(async (item: Partial<T>) => {
    setLoading(true);
    try {
      const created = await service.create(item);
      setData((prev) => [...prev, created]);
      return created;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const updateItem = useCallback(async (id: number | string, item: Partial<T>) => {
    setLoading(true);
    try {
      const updated = await service.update(id, item);
      setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)));
      return updated;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const deleteItem = useCallback(async (id: number | string) => {
    setLoading(true);
    try {
      await service.delete(id);
      setData((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch, fetchAll]);

  return {
    data,
    setData,
    loading,
    error,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
  };
}
