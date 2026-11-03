import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@sisinventario.com');
  const [password, setPassword] = useState('Admin123*');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-4">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">SisInventario</h2>
        <p className="mt-1 text-xs text-slate-400">Control Integral de Inventario Informático y Periféricos</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-700/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@empresa.com" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none transition shadow-lg shadow-emerald-600/25 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Iniciar Sesión</span><ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-[11px] text-slate-500">Credenciales demo: <span className="font-mono text-emerald-400">admin@sisinventario.com</span> / <span className="font-mono text-emerald-400">Admin123*</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
