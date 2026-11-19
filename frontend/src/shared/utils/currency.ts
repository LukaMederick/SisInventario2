/**
 * Utilidad centralizada de formateo para Moneda Soles (S/.)
 * Sigue el estándar monetario peruano (ISO 4217: PEN)
 */
export function formatSoles(amount: number | string | null | undefined): string {
  const val = Number(amount) || 0;
  return `S/ ${val.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
