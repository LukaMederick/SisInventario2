import { BaseApiService } from './BaseApiService';
import { Movement } from '../types';

export class MovementApiService extends BaseApiService<Movement> {
  constructor() {
    super('/movimientos');
  }
}

export const movementService = new MovementApiService();
