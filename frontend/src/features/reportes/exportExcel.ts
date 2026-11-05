import * as XLSX from 'xlsx';

export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName = 'Datos') {
  if (!data || data.length === 0) {
    alert('No hay datos disponibles para exportar.');
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

