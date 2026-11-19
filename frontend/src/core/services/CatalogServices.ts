import { BaseApiService } from './BaseApiService';
import { Category, Brand, Model, EquipmentState, Supplier } from '../types';

export class CategoryApiService extends BaseApiService<Category> {
  constructor() {
    super('/categorias');
  }
}

export class BrandApiService extends BaseApiService<Brand> {
  constructor() {
    super('/marcas');
  }
}

export class ModelApiService extends BaseApiService<Model> {
  constructor() {
    super('/modelos');
  }
}

export class EquipmentStateApiService extends BaseApiService<EquipmentState> {
  constructor() {
    super('/estados-equipo');
  }
}

export class SupplierApiService extends BaseApiService<Supplier> {
  constructor() {
    super('/proveedores');
  }
}

export const categoryService = new CategoryApiService();
export const brandService = new BrandApiService();
export const modelService = new ModelApiService();
export const equipmentStateService = new EquipmentStateApiService();
export const supplierService = new SupplierApiService();
