import { User, Warehouse } from './auth.types';
import { Category, Brand } from './catalog.types';
import { Asset } from './asset.types';

export interface Item {
  id: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  categoria?: Category;
  marca_id?: number;
  marca?: Brand;
  unidad: string;
  stock_minimo: number;
  activo: boolean;
  stocks?: Stock[];
  created_at?: string;
  updated_at?: string;
}

export interface Stock {
  id: number;
  item_id: number;
  item?: Item;
  almacen_id: number;
  almacen?: Warehouse;
  cantidad: number;
  cantidad_reservada?: number;
  ultimo_conteo?: string;
  updated_at?: string;
}

export interface Movement {
  id: number;
  tipo: 'entrada' | 'salida' | 'transferencia' | 'ajuste' | 'asignacion' | 'devolucion' | 'baja';
  activo_id?: number;
  activo?: Asset;
  item_id?: number;
  item?: Item;
  cantidad: number;
  almacen_origen_id?: number;
  almacen_origen?: Warehouse;
  almacen_destino_id?: number;
  almacen_destino?: Warehouse;
  usuario_destino_id?: string;
  usuario_destino?: User;
  motivo?: string;
  documento?: string;
  fecha: string;
  created_by?: string;
  creador?: User;
  created_at?: string;
}

