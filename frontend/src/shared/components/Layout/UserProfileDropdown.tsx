import React, { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';

export const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
          {user?.nombre_completo?.charAt(0) || 'U'}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.nombre_completo}</p>
          <p className="text-[10px] text-slate-500">{user?.rol?.nombre}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.nombre_completo}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-md border border-emerald-100">
              {user?.rol?.nombre}
            </span>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

