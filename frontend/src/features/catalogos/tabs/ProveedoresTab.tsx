import React from 'react';
import { Plus } from 'lucide-react';
import { Supplier } from '../../../core/types';

interface ProveedoresTabProps {
  proveedores: Supplier[];
  canEdit: boolean;
  onOpenCreate: () => void;
}

export const ProveedoresTab: React.FC<ProveedoresTabProps> = ({ proveedores, canEdit, onOpenCreate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Directorio de Proveedores y Servicios</h3>
        {canEdit && (
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Nuevo Proveedor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {proveedores.map((p) => (
          <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
            <p className="font-bold text-slate-800">{p.nombre}</p>
            <p className="text-slate-500 font-mono text-[11px]">RUC: {p.ruc || '—'}</p>
            <p className="text-slate-600 mt-1">Contacto: {p.contacto || '—'} • Tel: {p.telefono || '—'}</p>
            {p.email && <p className="text-slate-400 text-[11px]">{p.email}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

