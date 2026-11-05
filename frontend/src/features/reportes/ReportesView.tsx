import React from 'react';
import { FileText, Laptop, Layers, ArrowLeftRight, Wrench } from 'lucide-react';
import { ReportCard } from './ReportCard';
import { useReports } from './useReports';

export const ReportesView: React.FC = () => {
  const { loadingKey, exportActivos, exportStock, exportMovimientos, exportMantenimientos } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Centro de Reportes y Exportación
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Genera y descarga informes oficiales en formatos Excel (.xlsx) y PDF (.pdf)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <ReportCard
          title="Inventario General de Activos"
          description="Padrón completo de equipos informáticos, marcas, modelos, series, estados, ubicaciones y valorización en USD."
          icon={Laptop}
          badge="Equipos TI"
          onExportExcel={() => exportActivos('excel')}
          onExportPdf={() => exportActivos('pdf')}
          loading={loadingKey === 'activos'}
        />

        <ReportCard
          title="Control y Niveles de Insumos"
          description="Catálogo de consumibles y repuestos, stock por almacén y semáforo de alerta para materiales bajo el stock mínimo."
          icon={Layers}
          badge="Stock e Insumos"
          onExportExcel={() => exportStock('excel')}
          onExportPdf={() => exportStock('pdf')}
          loading={loadingKey === 'stock'}
        />

        <ReportCard
          title="Kardex de Movimientos"
          description="Trazabilidad cronológica de entradas por compras, salidas a servicios y ajustes de conteo físico con justificaciones."
          icon={ArrowLeftRight}
          badge="Kardex"
          onExportExcel={exportMovimientos}
          loading={loadingKey === 'movimientos'}
        />

        <ReportCard
          title="Historial de Mantenimientos"
          description="Registro de tickets preventivos y correctivos, costos de servicio, talleres o proveedores asignados y estado de atención."
          icon={Wrench}
          badge="Servicios"
          onExportExcel={() => exportMantenimientos('excel')}
          onExportPdf={() => exportMantenimientos('pdf')}
          loading={loadingKey === 'mantenimientos'}
        />
      </div>
    </div>
  );
};

