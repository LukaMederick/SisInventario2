import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import api from '../../core/api/axios.config';
import { User, Role } from '../../core/types';
import { DataTable } from '../../shared/components/DataTable';
import { UserWarehouseModal } from './UserWarehouseModal';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { useUserColumns } from './useUserColumns';

export const UsuariosList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usrRes, rolRes] = await Promise.all([api.get('/usuarios'), api.get('/roles')]);
      setUsers(usrRes.data || []);
      setRoles(rolRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = useUserColumns({
    onOpenWarehouse: (u) => { setSelectedUser(u); setIsWarehouseModalOpen(true); },
    onOpenEdit: (u) => { setSelectedUser(u); setIsEditOpen(true); },
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            Usuarios y Control de Acceso (RBAC)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Gestión de roles y asignación de almacenes autorizados</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Usuario
        </button>
      </div>

      <DataTable columns={columns} data={users} isLoading={loading} />

      {isWarehouseModalOpen && selectedUser && (
        <UserWarehouseModal isOpen={isWarehouseModalOpen} onClose={() => setIsWarehouseModalOpen(false)} user={selectedUser} onSuccess={fetchUsers} />
      )}
      {isCreateOpen && (
        <CreateUserModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} roles={roles} onSuccess={fetchUsers} />
      )}
      {isEditOpen && selectedUser && (
        <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={selectedUser} roles={roles} onSuccess={fetchUsers} />
      )}
    </div>
  );
};
