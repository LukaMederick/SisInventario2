export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria_padre_id?: number;
  categoria_padre?: Category;
  subcategorias?: Category[];
  created_at?: string;
}

export interface Brand {
  id: number;
  nombre: string;
  created_at?: string;
}

export interface Model {
  id: number;
  marca_id: number;
  marca?: Brand;
  categoria_id: number;
  categoria?: Category;
  nombre: string;
  especificaciones?: string;
  imagen_url?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EquipmentState {
  id: number;
  nombre: 'Disponible' | 'Asignado' | 'Mantenimiento' | 'Baja' | 'Perdido' | string;
  descripcion?: string;
  color: string;
  created_at?: string;
}

export interface Supplier {
  id: number;
  nombre: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  created_at?: string;
}

