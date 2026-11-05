import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Laptop, Layers, Tag, ShieldCheck, Building2 } from 'lucide-react';
import api from '../../core/api/axios.config';
import { useAuth } from '../../core/context/AuthContext';
import { Category, Brand, Model, EquipmentState, Supplier } from '../../core/types';
import { ModelosTab } from './tabs/ModelosTab';
import { CategoriasTab } from './tabs/CategoriasTab';
import { MarcasTab } from './tabs/MarcasTab';
import { EstadosTab } from './tabs/EstadosTab';
import { ProveedoresTab } from './tabs/ProveedoresTab';
import { CategoryModal } from './modals/CategoryModal';
import { BrandModal } from './modals/BrandModal';
import { ModelModal } from './modals/ModelModal';
import { SupplierModal } from './modals/SupplierModal';

type TabType = 'modelos' | 'categorias' | 'marcas' | 'estados' | 'proveedores';

export const CatalogosHub: React.FC = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('Administrador');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get('tab') as TabType) || 'modelos';

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [marcas, setMarcas] = useState<Brand[]>([]);
  const [modelos, setModelos] = useState<Model[]>([]);
  const [estados, setEstados] = useState<EquipmentState[]>([]);
  const [proveedores, setProveedores] = useState<Supplier[]>([]);

  const [modal, setModal] = useState<TabType | null>(null);

  const fetchAll = async () => {
    try {
      const [c, b, m, e, p] = await Promise.all([
        api.get('/categorias'), api.get('/marcas'), api.get('/modelos'),
        api.get('/estados-equipo'), api.get('/proveedores'),
      ]);
      setCategorias(c.data || []);
      setMarcas(b.data || []);
      setModelos(m.data || []);
      setEstados(e.data || []);
      setProveedores(p.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const tabs = [
    { key: 'modelos', label: `Modelos (${modelos.length})`, icon: Laptop },
    { key: 'categorias', label: `Categorías (${categorias.length})`, icon: Layers },
    { key: 'marcas', label: `Marcas (${marcas.length})`, icon: Tag },
    { key: 'estados', label: `Estados (${estados.length})`, icon: ShieldCheck },
    { key: 'proveedores', label: `Proveedores (${proveedores.length})`, icon: Building2 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
          Catálogos Maestros del Sistema
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Configuración de modelos, categorías, marcas, estados y proveedores</p>
      </div>

      <div className="flex border-b border-slate-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setSearchParams({ tab: t.key })}
              className={`flex items-center px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                currentTab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {currentTab === 'modelos' && <ModelosTab modelos={modelos} canEdit={canEdit} onOpenCreate={() => setModal('modelos')} />}
      {currentTab === 'categorias' && <CategoriasTab categorias={categorias} canEdit={canEdit} onOpenCreate={() => setModal('categorias')} />}
      {currentTab === 'marcas' && <MarcasTab marcas={marcas} canEdit={canEdit} onOpenCreate={() => setModal('marcas')} />}
      {currentTab === 'estados' && <EstadosTab estados={estados} />}
      {currentTab === 'proveedores' && <ProveedoresTab proveedores={proveedores} canEdit={canEdit} onOpenCreate={() => setModal('proveedores')} />}

      {modal === 'categorias' && <CategoryModal isOpen onClose={() => setModal(null)} onSuccess={fetchAll} />}
      {modal === 'marcas' && <BrandModal isOpen onClose={() => setModal(null)} onSuccess={fetchAll} />}
      {modal === 'modelos' && <ModelModal isOpen onClose={() => setModal(null)} marcas={marcas} categorias={categorias} onSuccess={fetchAll} />}
      {modal === 'proveedores' && <SupplierModal isOpen onClose={() => setModal(null)} onSuccess={fetchAll} />}
    </div>
  );
};
