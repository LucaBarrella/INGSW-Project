// src/api/ManagerApi.ts
import httpClient from '../core/httpClient';
import { ChangePasswordDTO } from '../dto/request/ChangePassword.dto';
import { SignupRequestAgent } from '../dto/request/SignupRequestAgent.dto';
import { IManagerApi } from './interfaces/IManagerApi';

const MANAGER_ENDPOINTS = {
  CREATE_AGENT: '/agent/create',
  CREATE_MANAGER: '/manager/create',
  CHANGE_PASSWORD: '/manager/change_password',
} as const;

export class ManagerApi implements IManagerApi {
  async createAgent(agentData: SignupRequestAgent): Promise<void> {
    const response = await httpClient.post(MANAGER_ENDPOINTS.CREATE_AGENT, agentData);
    return response.data;
  }

  async createManager(managerData: any): Promise<void> {
    const response = await httpClient.post(MANAGER_ENDPOINTS.CREATE_MANAGER, managerData);
    return response.data;
  }
  
  async changePassword(data: ChangePasswordDTO) {
    const response = await httpClient.post(MANAGER_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  }
}