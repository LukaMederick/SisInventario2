import { BaseApiService } from './BaseApiService';
import { Item, Stock } from '../types';
import api from '../api/axios.config';

// Herencia POO: StockApiService hereda de BaseApiService
export class StockApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }

  async getWarehouseStock(almacenId?: number, search?: string): Promise<Stock[]> {
    const res = await api.get('/stock', { params: { almacen_id: almacenId, search } });
    return res.data;
  }

  async getCriticalStock(): Promise<any[]> {
    const res = await api.get('/stock/critico');
    return res.data;
  }

  async ajustarStock(itemId: number, almacenId: number, nuevaCantidad: number, motivo: string): Promise<void> {
    await api.post('/stock/ajustar', {
      item_id: itemId,
      almacen_id: almacenId,
      nueva_cantidad: nuevaCantidad,
      motivo,
    });
  }

  async registrarEntrada(itemId: number, almacenId: number, cantidad: number, documento?: string, motivo?: string): Promise<void> {
    await api.post('/stock/entrada', {
      item_id: itemId,
      almacen_id: almacenId,
      cantidad,
      documento,
      motivo,
    });
  }
}

export const stockService = new StockApiService();

