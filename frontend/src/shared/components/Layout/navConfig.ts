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
} from 'lucide-react';

export const navGroups = [
  {
    group: 'Principal',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
    ],
  },
  {
    group: 'Gestión de Equipos',
    items: [
      { to: '/activos', label: 'Activos Físicos', icon: Laptop, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
      { to: '/asignaciones', label: 'Asignaciones', icon: UserCheck, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
      { to: '/mantenimientos', label: 'Mantenimientos', icon: Wrench, roles: ['Administrador', 'Encargado de almacén', 'Técnico'] },
    ],
  },
  {
    group: 'Insumos y Stock',
    items: [
      { to: '/items', label: 'Catálogo de Insumos', icon: Boxes, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
      { to: '/stock', label: 'Control de Stock', icon: Layers, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
      { to: '/movimientos', label: 'Bitácora Movimientos', icon: ArrowLeftRight, roles: ['Administrador', 'Encargado de almacén', 'Técnico', 'Auditor'] },
    ],
  },
  {
    group: 'Administración',
    items: [
      { to: '/catalogos', label: 'Catálogos Base', icon: BookOpen, roles: ['Administrador', 'Encargado de almacén'] },
      { to: '/almacenes', label: 'Almacenes', icon: WarehouseIcon, roles: ['Administrador'] },
      { to: '/usuarios', label: 'Usuarios y Roles', icon: Users, roles: ['Administrador'] },
      { to: '/auditoria', label: 'Auditoría', icon: ShieldCheck, roles: ['Administrador', 'Auditor'] },
    ],
  },
];

