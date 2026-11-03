import React, { useState } from 'react';
import { Menu, Warehouse, QrCode } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { QrScannerModal } from '../QrScannerModal';
import { useNavigate } from 'react-router-dom';
import { UserProfileDropdown } from './UserProfileDropdown';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { selectedWarehouse, warehouses, setSelectedWarehouse, hasRole } = useAuth();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const navigate = useNavigate();

  const handleQrSuccess = (scannedCode: string) => {
    navigate(`/activos?search=${encodeURIComponent(scannedCode)}`);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
            <Warehouse className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Almacén:</span>
            <select
              value={selectedWarehouse?.id || ''}
              onChange={(e) => {
                const wh = warehouses.find((w) => w.id === Number(e.target.value));
                setSelectedWarehouse(wh || null);
              }}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {hasRole('Administrador') && <option value="">Todos los almacenes</option>}
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nombre} ({w.codigo})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsQrOpen(true)}
            title="Escanear Código QR"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200/80 transition"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Escanear QR</span>
          </button>

          <UserProfileDropdown />
        </div>
      </header>

      {isQrOpen && (
        <QrScannerModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          onScanSuccess={handleQrSuccess}
        />
      )}
    </>
  );
};
