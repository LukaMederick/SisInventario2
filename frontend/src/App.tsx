import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import { MainLayout } from './shared/components/Layout/MainLayout';

// Features
import { Login } from './features/auth/Login';
import { Dashboard } from './features/dashboard/Dashboard';
import { ActivosList } from './features/activos/ActivosList';
import { ItemsList } from './features/items/ItemsList';
import { StockOverview } from './features/items/StockOverview';
import { MovimientosList } from './features/movimientos/MovimientosList';
import { AsignacionesList } from './features/asignaciones/AsignacionesList';
import { MantenimientosList } from './features/mantenimientos/MantenimientosList';
import { CatalogosHub } from './features/catalogos/CatalogosHub';
import { AlmacenesList } from './features/almacenes/AlmacenesList';
import { UsuariosList } from './features/usuarios/UsuariosList';
import { AuditoriaList } from './features/auditoria/AuditoriaList';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Main Shell */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activos" element={<ActivosList />} />
            <Route path="/items" element={<ItemsList />} />
            <Route path="/stock" element={<StockOverview />} />
            <Route path="/movimientos" element={<MovimientosList />} />
            <Route path="/asignaciones" element={<AsignacionesList />} />
            <Route path="/mantenimientos" element={<MantenimientosList />} />
            <Route path="/catalogos" element={<CatalogosHub />} />
            <Route path="/almacenes" element={<AlmacenesList />} />
            <Route path="/usuarios" element={<UsuariosList />} />
            <Route path="/auditoria" element={<AuditoriaList />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

