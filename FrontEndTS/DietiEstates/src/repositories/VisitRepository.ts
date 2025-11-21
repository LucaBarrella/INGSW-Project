import { VisitDTO } from '../dto/VisitDTO';
import httpClient from '../core/httpClient';
import { IVisitRepository } from './interfaces/IVisitRepository';

const visitEndpoints = {
  scheduleVisit: '/visits/schedule',
  getVisitsByProperty: '/properties/{propertyId}/visits',
  getVisitsByAgent: '/agent/visits',
  getVisitsByBuyer: '/buyer/visits',
  getVisitById: '/visits/{visitId}',
  updateVisit: '/visits/{visitId}',
  cancelVisit: '/visits/{visitId}/cancel',
  confirmVisit: '/visits/{visitId}/confirm',
} as const;

export class VisitRepository implements IVisitRepository {
  async scheduleVisit(visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string; id?: string | number }> {
    console.log('[VisitRepository] scheduleVisit:', visitData);
    const response = await httpClient.post(visitEndpoints.scheduleVisit, visitData);
    return response.data;
  }

  async getVisitsByProperty(propertyId: string | number): Promise<any[]> {
    console.log('[VisitRepository] getVisitsByProperty:', propertyId);
    const url = visitEndpoints.getVisitsByProperty.replace('{propertyId}', propertyId.toString());
    const response = await httpClient.get(url);
    return response.data;
  }

  async getVisitsByAgent(agentId?: string): Promise<any[]> {
    console.log('[VisitRepository] getVisitsByAgent:', agentId);
    const url = agentId ? `${visitEndpoints.getVisitsByAgent}?agentId=${agentId}` : visitEndpoints.getVisitsByAgent;
    const response = await httpClient.get(url);
    return response.data;
  }

  async getVisitsByBuyer(buyerId?: string): Promise<any[]> {
    console.log('[VisitRepository] getVisitsByBuyer:', buyerId);
    const url = buyerId ? `${visitEndpoints.getVisitsByBuyer}?buyerId=${buyerId}` : visitEndpoints.getVisitsByBuyer;
    const response = await httpClient.get(url);
    return response.data;
  }

  async getVisitById(visitId: string | number): Promise<any> {
    console.log('[VisitRepository] getVisitById:', visitId);
    const url = visitEndpoints.getVisitById.replace('{visitId}', visitId.toString());
    const response = await httpClient.get(url);
    return response.data;
  }

  async updateVisit(visitId: string | number, visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitRepository] updateVisit:', visitId, visitData);
    const url = visitEndpoints.updateVisit.replace('{visitId}', visitId.toString());
    const response = await httpClient.put(url, visitData);
    return response.data;
  }

  async cancelVisit(visitId: string | number): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitRepository] cancelVisit:', visitId);
    const url = visitEndpoints.cancelVisit.replace('{visitId}', visitId.toString());
    const response = await httpClient.post(url);
    return response.data;
  }

  async confirmVisit(visitId: string | number): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitRepository] confirmVisit:', visitId);
    const url = visitEndpoints.confirmVisit.replace('{visitId}', visitId.toString());
    const response = await httpClient.post(url);
    return response.data;
  }
}