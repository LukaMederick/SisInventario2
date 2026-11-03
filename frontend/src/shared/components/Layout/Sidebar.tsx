import React from 'react';
import { NavLink } from 'react-router-dom';
import { Laptop, X } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { navGroups } from './navConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none">SisInventario</h1>
              <p className="text-[10px] text-emerald-400 font-medium mt-1">SISTEMA TI & CONTROL</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((grp) => {
            const filteredItems = grp.items.filter((item) => (item.roles ? hasRole(...item.roles) : true));
            if (filteredItems.length === 0) return null;
            return (
              <div key={grp.group}>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{grp.group}</p>
                <nav className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 mr-3 stroke-[2]" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700/40 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
              {user?.nombre_completo?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.nombre_completo}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user?.rol?.nombre}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
