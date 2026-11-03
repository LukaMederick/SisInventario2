import React, { useState, useEffect } from 'react';
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

export const CatalogosHub: React.FC = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('Administrador');
  const [tab, setTab] = useState<'modelos' | 'categorias' | 'marcas' | 'estados' | 'proveedores'>('modelos');

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [marcas, setMarcas] = useState<Brand[]>([]);
  const [modelos, setModelos] = useState<Model[]>([]);
  const [estados, setEstados] = useState<EquipmentState[]>([]);
  const [proveedores, setProveedores] = useState<Supplier[]>([]);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isSupOpen, setIsSupOpen] = useState(false);

  const fetchAll = async () => {
    try {
      const [catRes, braRes, modRes, estRes, supRes] = await Promise.all([
        api.get('/categorias'), api.get('/marcas'), api.get('/modelos'),
        api.get('/estados-equipo'), api.get('/proveedores'),
      ]);
      setCategorias(catRes.data || []);
      setMarcas(braRes.data || []);
      setModelos(modRes.data || []);
      setEstados(estRes.data || []);
      setProveedores(supRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

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
        <p className="text-xs text-slate-500 mt-0.5">
          Configuración de categorías, marcas, modelos, estados y proveedores
        </p>
      </div>

      <div className="flex border-b border-slate-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`flex items-center px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'modelos' && <ModelosTab modelos={modelos} canEdit={canEdit} onOpenCreate={() => setIsModelOpen(true)} />}
      {tab === 'categorias' && <CategoriasTab categorias={categorias} canEdit={canEdit} onOpenCreate={() => setIsCatOpen(true)} />}
      {tab === 'marcas' && <MarcasTab marcas={marcas} canEdit={canEdit} onOpenCreate={() => setIsBrandOpen(true)} />}
      {tab === 'estados' && <EstadosTab estados={estados} />}
      {tab === 'proveedores' && <ProveedoresTab proveedores={proveedores} canEdit={canEdit} onOpenCreate={() => setIsSupOpen(true)} />}

      {isCatOpen && <CategoryModal isOpen={isCatOpen} onClose={() => setIsCatOpen(false)} onSuccess={fetchAll} />}
      {isBrandOpen && <BrandModal isOpen={isBrandOpen} onClose={() => setIsBrandOpen(false)} onSuccess={fetchAll} />}
      {isModelOpen && <ModelModal isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} marcas={marcas} categorias={categorias} onSuccess={fetchAll} />}
      {isSupOpen && <SupplierModal isOpen={isSupOpen} onClose={() => setIsSupOpen(false)} onSuccess={fetchAll} />}
    </div>
  );
};
