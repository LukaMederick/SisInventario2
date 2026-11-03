import api from '../api/axios.config';

// Clase base abstracta con operaciones CRUD genéricas (Herencia POO en TypeScript)
export abstract class BaseApiService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(params?: any): Promise<T[]> {
    const res = await api.get(this.endpoint, { params });
    return res.data.data !== undefined ? res.data.data : res.data;
  }

  async getById(id: number | string): Promise<T> {
    const res = await api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const res = await api.post(this.endpoint, data);
    return res.data;
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    const res = await api.put(`${this.endpoint}/${id}`, data);
    return res.data;
  }

  async delete(id: number | string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

