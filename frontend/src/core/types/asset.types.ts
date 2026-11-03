import { User, Warehouse } from './auth.types';
import { Model, EquipmentState, Supplier } from './catalog.types';

export interface Asset {
  id: number;
  codigo_activo: string;
  numero_serie: string;
  modelo_id: number;
  modelo?: Model;
  almacen_id: number;
  almacen?: Warehouse;
  estado_id: number;
  estado?: EquipmentState;
  proveedor_id?: number;
  proveedor?: Supplier;
  fecha_compra?: string;
  precio: number;
  garantia_hasta?: string;
  condicion: 'nuevo' | 'usado' | string;
  ubicacion_detalle?: string;
  asignado_a?: string;
  usuario_asignado?: User;
  notas?: string;
  activo: boolean;
  created_by?: string;
  creador?: User;
  created_at?: string;
  updated_at?: string;
}

export interface Assignment {
  id: number;
  activo_id: number;
  activo?: Asset;
  asignado_a: string;
  usuario?: User;
  almacen_id: number;
  almacen?: Warehouse;
  fecha_asignacion: string;
  fecha_devolucion?: string;
  estado: 'activa' | 'devuelta' | 'finalizada';
  notas?: string;
  created_by?: string;
  creador?: User;
  created_at?: string;
}

export interface Maintenance {
  id: number;
  activo_id: number;
  activo?: Asset;
  tipo: 'preventivo' | 'correctivo';
  descripcion: string;
  proveedor_id?: number;
  proveedor?: Supplier;
  costo: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
  created_by?: string;
  creador?: User;
  created_at?: string;
  updated_at?: string;
}

