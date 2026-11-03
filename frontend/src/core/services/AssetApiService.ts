import { BaseApiService } from './BaseApiService';
import { Asset } from '../types';
import api from '../api/axios.config';

// Herencia POO: AssetApiService hereda de BaseApiService
export class AssetApiService extends BaseApiService<Asset> {
  constructor() {
    super('/activos');
  }

  async transferir(id: number, almacenDestinoId: number, motivo: string, almacenOrigenId?: number): Promise<void> {
    await api.post(`${this.endpoint}/${id}/transferir`, {
      almacen_destino_id: almacenDestinoId,
      almacen_origen_id: almacenOrigenId,
      motivo,
    });
  }

  async asignar(id: number, usuarioDestinoId: string, notas?: string, almacenId?: number): Promise<void> {
    await api.post(`${this.endpoint}/${id}/asignar`, {
      usuario_destino_id: usuarioDestinoId,
      almacen_id: almacenId,
      notas,
    });
  }

  async devolver(id: number, estadoEquipoId?: number, notas?: string, almacenId?: number): Promise<void> {
    await api.post(`${this.endpoint}/${id}/devolver`, {
      estado_equipo_id: estadoEquipoId,
      almacen_id: almacenId,
      notas,
    });
  }
}

export const assetService = new AssetApiService();

