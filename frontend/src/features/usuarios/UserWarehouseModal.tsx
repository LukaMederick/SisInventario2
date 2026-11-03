import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { User, Warehouse } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import api from '../../core/api/axios.config';

interface UserWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export const UserWarehouseModal: React.FC<UserWarehouseModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [selectedIDs, setSelectedIDs] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/almacenes').then((res) => {
      setAlmacenes(res.data || []);
      setSelectedIDs((user.almacenes || []).map((w) => w.id));
    }).catch(console.error);
  }, [user]);

  const toggleWarehouse = (id: number) => {
    setSelectedIDs((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/usuarios/${user.id}/almacenes`, { almacenes_ids: selectedIDs });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignación de Almacenes Autorizados" subtitle={`Usuario: ${user.nombre_completo} (${user.rol?.nombre})`} maxWidth="md">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">Selecciona los almacenes autorizados para este colaborador:</p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {almacenes.map((w) => {
            const isChecked = selectedIDs.includes(w.id);
            return (
              <div
                key={w.id}
                onClick={() => toggleWarehouse(w.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition ${
                  isChecked ? 'border-emerald-500 bg-emerald-50/50 text-slate-800 font-semibold' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div><span>{w.nombre}</span><span className="font-mono text-slate-400 block text-[10px]">{w.codigo} • {w.ciudad}</span></div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancelar</button>
          <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar Asignaciones'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
