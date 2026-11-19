import { BaseApiService } from './BaseApiService';
import { Warehouse } from '../types';

export class WarehouseApiService extends BaseApiService<Warehouse> {
  constructor() {
    super('/almacenes');
  }
}

export const warehouseService = new WarehouseApiService();
