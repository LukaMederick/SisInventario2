import { BaseApiService } from './BaseApiService';
import { Item } from '../types';

export class ItemApiService extends BaseApiService<Item> {
  constructor() {
    super('/items');
  }
}

export const itemService = new ItemApiService();
