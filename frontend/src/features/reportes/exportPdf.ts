import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportTablePdf(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  fileName: string
) {
  if (!rows || rows.length === 0) {
    alert('No hay registros para generar el PDF.');
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  // Encabezado corporativo
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('SisInventario - Control de Inventario TI', 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(title, 40, 60);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  const now = new Date().toLocaleString('es-PE');
  doc.text(`Fecha y hora de emisión: ${now}`, 40, 75);

  autoTable(doc, {
    startY: 90,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
}

