import { BaseApiService } from './BaseApiService';
import { Maintenance } from '../types';
import api from '../api/axios.config';

// Herencia POO: MaintenanceApiService hereda de BaseApiService
export class MaintenanceApiService extends BaseApiService<Maintenance> {
  constructor() {
    super('/mantenimientos');
  }

  async updateStatus(id: number, estado: string, fechaFin?: string, costo?: number): Promise<Maintenance> {
    const res = await api.put(`${this.endpoint}/${id}/estado`, {
      estado,
      fecha_fin: fechaFin,
      costo,
    });
    return res.data;
  }
}

export const maintenanceService = new MaintenanceApiService();

