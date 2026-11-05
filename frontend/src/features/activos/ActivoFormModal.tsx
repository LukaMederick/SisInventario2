import React, { useState } from 'react';
import { Asset } from '../../core/types';
import { Modal } from '../../shared/components/Modal';
import { ActivoCoreFields } from './ActivoCoreFields';
import { ActivoDetailsFields } from './ActivoDetailsFields';
import { SupplierModal } from '../catalogos/modals/SupplierModal';
import { useActivoForm } from './useActivoForm';

interface ActivoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assetToEdit?: Asset | null;
}

export const ActivoFormModal: React.FC<ActivoFormModalProps> = ({
  isOpen, onClose, onSuccess, assetToEdit,
}) => {
  const form = useActivoForm(assetToEdit, onSuccess, onClose);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const handleSupplierCreated = (newSup?: any) => {
    form.refreshProveedores(newSup?.id);
    setIsSupplierModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={assetToEdit ? 'Editar Activo Informático' : 'Registrar Nuevo Activo'}
        subtitle="Ingresa la información técnica y de ubicación del activo"
        maxWidth="2xl"
      >
        {form.error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{form.error}</div>}
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActivoCoreFields
              codigoActivo={form.codigoActivo} setCodigoActivo={form.setCodigoActivo}
              numeroSerie={form.numeroSerie} setNumeroSerie={form.setNumeroSerie}
              modeloID={form.modeloID} setModeloID={form.setModeloID}
              almacenID={form.almacenID} setAlmacenID={form.setAlmacenID}
              estadoID={form.estadoID} setEstadoID={form.setEstadoID}
              modelos={form.modelos} almacenes={form.almacenes} estados={form.estados}
            />
            <ActivoDetailsFields
              proveedorID={form.proveedorID} setProveedorID={form.setProveedorID}
              precio={form.precio} setPrecio={form.setPrecio}
              condicion={form.condicion} setCondicion={form.setCondicion}
              ubicacionDetalle={form.ubicacionDetalle} setUbicacionDetalle={form.setUbicacionDetalle}
              notas={form.notas} setNotas={form.setNotas}
              proveedores={form.proveedores}
              onOpenNewSupplier={() => setIsSupplierModalOpen(true)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
              Cancelar
            </button>
            <button type="submit" disabled={form.loading} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition disabled:opacity-50">
              {form.loading ? 'Guardando...' : assetToEdit ? 'Actualizar Activo' : 'Guardar Activo'}
            </button>
          </div>
        </form>
      </Modal>

      {isSupplierModalOpen && (
        <SupplierModal
          isOpen={isSupplierModalOpen}
          onClose={() => setIsSupplierModalOpen(false)}
          onSuccess={handleSupplierCreated}
        />
      )}
    </>
  );
};
