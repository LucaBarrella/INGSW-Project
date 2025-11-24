// src/api/ManagerApi.ts
import httpClient from '../core/httpClient';
import { IManagerApi } from './interfaces/IManagerApi';

export class ManagerApi implements IManagerApi {
  async createAgent(agentData: any): Promise<void> {
    const response = await httpClient.post('/managers/agents', agentData);
    return response.data;
  }

  // Other manager-related API methods would go here
}