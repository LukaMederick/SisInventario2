export interface Role {
  id: number;
  nombre: 'Administrador' | 'Encargado de almacén' | 'Técnico' | 'Auditor' | string;
  descripcion?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  nombre_completo: string;
  telefono?: string;
  rol_id: number;
  rol?: Role;
  activo: boolean;
  almacenes?: Warehouse[];
  created_at?: string;
  updated_at?: string;
}

export interface Warehouse {
  id: number;
  codigo: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  responsable_id?: string;
  responsable?: User;
  telefono?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  selectedWarehouse: Warehouse | null;
  warehouses: Warehouse[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
  hasWarehouseAccess: (warehouseId?: number) => boolean;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  refreshProfile: () => Promise<void>;
}
