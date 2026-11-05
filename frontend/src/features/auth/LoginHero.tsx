import React from 'react';
import { Laptop, CheckCircle2 } from 'lucide-react';

export const LoginHero: React.FC = () => {
  return (
    <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
      <img
        src="/assets/almacen-login.jpg"
        alt="Almacén de Inventario"
        className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-105 scale-105 transition-transform duration-1000 hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />

      <div className="relative z-10 flex items-center space-x-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
          <Laptop className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">SisInventario</h1>
          <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">Gestión TI & Activos</p>
        </div>
      </div>

      <div className="relative z-10 max-w-lg space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
          Plataforma Integral de Inventario
        </span>
        <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Control físico, trazabilidad y stock en tiempo real.
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Administra laptops, servidores, insumos y periféricos con escaneo QR instantáneo, asignaciones y auditoría inmutable.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Multi-almacén</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Escaneo QR</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Transacciones ACID</span>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-500">© 2026 SisInventario. Sistema de Control Informático y Periféricos.</p>
    </div>
  );
};

