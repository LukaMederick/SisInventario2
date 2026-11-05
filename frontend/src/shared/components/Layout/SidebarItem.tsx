import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from './navConfig';

interface SidebarItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, onNavigate }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isParentActive = location.pathname.startsWith(item.to);
  const [isOpen, setIsOpen] = useState(isParentActive);
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            isParentActive ? 'text-white bg-slate-800/80' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-3 stroke-[2]" />
            <span>{item.label}</span>
          </div>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {isOpen && (
          <div className="pl-9 pr-2 space-y-1">
            {item.children!.map((child) => {
              const fullPath = `${location.pathname}${location.search}`;
              const isChildActive = fullPath === child.to || (!location.search && child.to.endsWith('=modelos') && location.pathname === '/catalogos');
              return (
                <NavLink
                  key={child.to}
                  to={child.to}
                  onClick={onNavigate}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isChildActive ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isActive
            ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-900/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`
      }
    >
      <Icon className="w-4 h-4 mr-3 stroke-[2]" />
      {item.label}
    </NavLink>
  );
};

