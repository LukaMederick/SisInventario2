import React, { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Warehouse, User } from '../../core/types';
import { WarehouseCard } from './WarehouseCard';
import { CreateWarehouseModal } from './CreateWarehouseModal';

export const AlmacenesList: React.FC = () => {
  const { hasRole } = useAuth();
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [almRes, usrRes] = await Promise.all([
        api.get('/almacenes'),
        api.get('/usuarios'),
      ]);
      setAlmacenes(almRes.data || []);
      setUsuarios(usrRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <WarehouseIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Gestión de Almacenes y Sedes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Centros de distribución, bodegas centrales y almacenes</p>
        </div>
        {hasRole('Administrador') && (
          <button onClick={() => setIsOpen(true)} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Almacén
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Cargando almacenes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {almacenes.map((w) => (
            <WarehouseCard key={w.id} warehouse={w} />
          ))}
        </div>
      )}

      {isOpen && (
        <CreateWarehouseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSuccess={fetchData}
          usuarios={usuarios}
        />
      )}
    </div>
  );
};
