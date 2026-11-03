import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

interface QrCodeBadgeProps {
  codigoActivo: string;
  numeroSerie: string;
  modeloNombre?: string;
  size?: number;
}

export const QrCodeBadge: React.FC<QrCodeBadgeProps> = ({
  codigoActivo,
  numeroSerie,
  modeloNombre = 'Equipo Informático',
  size = 120,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=500,height=500');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta de Activo - ${codigoActivo}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: 20px;
            }
            .label-card {
              border: 2px dashed #000;
              padding: 16px;
              width: 280px;
              text-align: center;
              border-radius: 8px;
            }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
            .subtitle { font-size: 11px; color: #444; margin-bottom: 12px; }
            .code { font-family: monospace; font-size: 16px; font-weight: bold; margin-top: 10px; }
            .sn { font-size: 10px; color: #666; margin-top: 2px; }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="title">SISINVENTARIO</div>
            <div class="subtitle">${modeloNombre}</div>
            ${printAreaRef.current?.innerHTML || ''}
            <div class="code">${codigoActivo}</div>
            <div class="sn">S/N: ${numeroSerie}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div ref={printAreaRef} className="p-2 bg-white rounded-xl border border-slate-100 shadow-inner">
        <QRCodeSVG
          value={codigoActivo}
          size={size}
          level="H"
          includeMargin={false}
        />
      </div>

      <div className="mt-3 text-center">
        <p className="font-mono font-bold text-sm text-slate-800">{codigoActivo}</p>
        <p className="text-[11px] text-slate-500 font-mono">S/N: {numeroSerie}</p>
      </div>

      <button
        onClick={handlePrint}
        type="button"
        className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
      >
        <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
        Imprimir Etiqueta
      </button>
    </div>
  );
};

