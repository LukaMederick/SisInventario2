import React from 'react';
import { Modal } from '../../shared/components/Modal';
import { useRegistrarMovimiento } from './useRegistrarMovimiento';

interface RegistrarMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrarMovimientoModal: React.FC<RegistrarMovimientoModalProps> = ({
  isOpen, onClose, onSuccess,
}) => {
  const f = useRegistrarMovimiento(onSuccess, onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Movimiento" maxWidth="md">
      {f.error && <div className="mb-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">{f.error}</div>}
      <form onSubmit={f.handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de movimiento *</label>
            <select value={f.tipo} onChange={(e) => f.setTipo(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              <option value="ajuste">Ajuste</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="transferencia">Transferencia</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Aplica a *</label>
            <select value={f.aplicaA} onChange={(e) => f.setAplicaA(e.target.value as any)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              <option value="activo">Activo (Equipo)</option>
              <option value="item">Ítem (Insumo)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">{f.aplicaA === 'activo' ? 'Activo *' : 'Ítem *'}</label>
          {f.aplicaA === 'activo' ? (
            <select value={f.activoID} onChange={(e) => f.setActivoID(e.target.value)} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              {f.activos.map((a) => <option key={a.id} value={a.id}>{a.codigo_activo} - {a.modelo?.nombre} ({a.numero_serie})</option>)}
            </select>
          ) : (
            <select value={f.itemID} onChange={(e) => f.setItemID(e.target.value)} required className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              {f.items.map((i) => <option key={i.id} value={i.id}>{i.sku} - {i.nombre}</option>)}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad *</label>
            <input type="number" min="1" required value={f.cantidad} onChange={(e) => f.setCantidad(Number(e.target.value))} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Documento</label>
            <input type="text" value={f.documento} onChange={(e) => f.setDocumento(e.target.value)} placeholder="Ej. Guía, Factura F001..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén origen</label>
            <select value={f.origenID} onChange={(e) => f.setOrigenID(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              <option value="">Seleccionar origen...</option>
              {f.almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Almacén destino</label>
            <select value={f.destinoID} onChange={(e) => f.setDestinoID(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800">
              <option value="">Seleccionar destino...</option>
              {f.almacenes.map((w) => <option key={w.id} value={w.id}>{w.nombre} ({w.codigo})</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo *</label>
          <textarea rows={2} required value={f.motivo} onChange={(e) => f.setMotivo(e.target.value)} placeholder="Describe la justificación del movimiento..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancelar</button>
          <button type="submit" disabled={f.loading} className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50">
            {f.loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

