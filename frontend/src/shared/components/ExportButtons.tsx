import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonsProps {
  title: string;
  filename: string;
  headers: string[];
  data: (string | number)[][];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  title,
  filename,
  headers,
  data,
}) => {
  const exportToExcel = () => {
    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Header
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(`SisInventario - ${title}`, 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 25);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={exportToExcel}
        type="button"
        title="Exportar a Excel"
        className="inline-flex items-center px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
      >
        <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
        Excel
      </button>

      <button
        onClick={exportToPDF}
        type="button"
        title="Exportar a PDF"
        className="inline-flex items-center px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
      >
        <FileText className="w-4 h-4 mr-1.5 text-rose-600" />
        PDF
      </button>
    </div>
  );
};

