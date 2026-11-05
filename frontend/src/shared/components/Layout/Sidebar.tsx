import React from 'react';
import { Laptop, X } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { navItems } from './navConfig';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();
  const handleNav = () => { if (window.innerWidth < 1024) onClose(); };

  const filteredItems = navItems.filter((item) =>
    item.roles ? hasRole(...item.roles) : true
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1527] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none">SisInventario</h1>
              <p className="text-[10px] text-indigo-400 font-semibold mt-1">SISTEMA TI & CONTROL</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          {filteredItems.map((item) => (
            <SidebarItem key={item.to} item={item} onNavigate={handleNav} />
          ))}
        </nav>

        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-700/40">
              {user?.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.nombre_completo}</p>
              <p className="text-[10px] text-indigo-400 truncate">{user?.rol?.nombre}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
