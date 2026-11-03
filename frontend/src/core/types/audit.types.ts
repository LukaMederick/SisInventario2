import { User } from './auth.types';
import { Movement } from './stock.types';

export interface AuditLog {
  id: number;
  tabla: string;
  registro_id: string;
  accion: 'INSERT' | 'UPDATE' | 'DELETE' | string;
  datos_anteriores?: string;
  datos_nuevos?: string;
  usuario_id?: string;
  usuario?: User;
  created_at: string;
}

export interface DashboardMetrics {
  total_activos: number;
  valor_total_inventario: number;
  activos_asignados: number;
  en_mantenimiento: number;
  items_stock_critico: number;
  total_insumos: number;
  distribucion_por_estado: { nombre: string; color: string; total: number }[];
  distribucion_por_categoria: { categoria: string; total: number }[];
  movimientos_recientes: Movement[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

