import {
  LayoutDashboard,
  Laptop,
  Boxes,
  Layers,
  ArrowLeftRight,
  UserCheck,
  Wrench,
  BookOpen,
  Warehouse as WarehouseIcon,
  Users,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export interface NavChild {
  to: string;
  label: string;
}

export interface NavItem {
  to: string;
  label: string;
  icon: any;
  roles?: string[];
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/almacenes', label: 'Almacenes', icon: WarehouseIcon, roles: ['Administrador'] },
  {
    to: '/catalogos',
    label: 'Catálogos',
    icon: BookOpen,
    roles: ['Administrador', 'Encargado de almacén'],
    children: [
      { to: '/catalogos?tab=categorias', label: 'Categorías' },
      { to: '/catalogos?tab=marcas', label: 'Marcas' },
      { to: '/catalogos?tab=modelos', label: 'Modelos' },
      { to: '/catalogos?tab=estados', label: 'Estados de Equipo' },
      { to: '/catalogos?tab=proveedores', label: 'Proveedores' },
    ],
  },
  { to: '/activos', label: 'Activos (Equipos)', icon: Laptop, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/items', label: 'Ítems', icon: Boxes, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/stock', label: 'Control de Stock', icon: Layers, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/asignaciones', label: 'Asignaciones', icon: UserCheck, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
  { to: '/mantenimientos', label: 'Mantenimientos', icon: Wrench, roles: ['Administrador', 'Encargado de almacén', 'Técnico'] },
  { to: '/usuarios', label: 'Usuarios & Roles', icon: Users, roles: ['Administrador'] },
  { to: '/auditoria', label: 'Auditoría', icon: ShieldCheck, roles: ['Administrador', 'Auditor'] },
  { to: '/reportes', label: 'Reportes', icon: FileText, roles: ['Administrador', 'Auditor', 'Encargado de almacén', 'Técnico'] },
];
