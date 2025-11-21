import { VisitDTO } from '../../dto/VisitDTO';

export interface IVisitService {
  scheduleVisit(visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string; id?: string | number }>;
  getVisitsByProperty(propertyId: string | number): Promise<any[]>;
  getVisitsByAgent(agentId?: string): Promise<any[]>;
  getVisitsByBuyer(buyerId?: string): Promise<any[]>;
  getVisitById(visitId: string | number): Promise<any>;
  updateVisit(visitId: string | number, visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string }>;
  cancelVisit(visitId: string | number): Promise<{ success: boolean; message?: string }>;
  confirmVisit(visitId: string | number): Promise<{ success: boolean; message?: string }>;
}