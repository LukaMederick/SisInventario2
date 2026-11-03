import React from 'react';
import { Asset } from '../../../core/types';
import { Badge } from '../../../shared/components/Badge';
import { QrCodeBadge } from '../../../shared/components/QrCodeBadge';

interface ActivoInfoTabProps {
  activo: Asset;
}

export const ActivoInfoTab: React.FC<ActivoInfoTabProps> = ({ activo }) => {
  let parsedSpecs: Record<string, any> = {};
  try {
    if (activo.modelo?.especificaciones) {
      parsedSpecs = JSON.parse(activo.modelo.especificaciones);
    }
  } catch {
    // Specs string
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Estado Actual:</span>
            <Badge color={activo.estado?.color}>{activo.estado?.nombre}</Badge>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Almacén:</span>
            <span className="font-semibold text-slate-800">{activo.almacen?.nombre}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Marca / Fabricante:</span>
            <span className="font-semibold text-slate-800">{activo.modelo?.marca?.nombre}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Categoría:</span>
            <span className="font-semibold text-slate-800">{activo.modelo?.categoria?.nombre}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Condición:</span>
            <span className="font-semibold uppercase text-slate-800">{activo.condicion}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Ubicación Física:</span>
            <span className="font-medium text-slate-700">{activo.ubicacion_detalle || 'No especificada'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Precio de Adquisición:</span>
            <span className="font-mono font-bold text-slate-800">${Number(activo.precio).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Proveedor:</span>
            <span className="font-medium text-slate-700">{activo.proveedor?.nombre || '—'}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-2">Especificaciones Técnicas</h4>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
            {Object.keys(parsedSpecs).length > 0 ? (
              Object.entries(parsedSpecs).map(([key, val]) => (
                <div key={key}>
                  <span className="text-slate-400 capitalize">{key}: </span>
                  <span className="font-semibold text-slate-700">{String(val)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 col-span-2 italic">Sin especificaciones registradas</p>
            )}
          </div>
        </div>

        {activo.notas && (
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1">Notas</h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {activo.notas}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-start">
        <QrCodeBadge
          codigoActivo={activo.codigo_activo}
          numeroSerie={activo.numero_serie}
          modeloNombre={activo.modelo?.nombre}
          size={140}
        />
      </div>
    </div>
  );
};

