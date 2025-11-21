import { VisitDTO } from '../dto/VisitDTO';
import { IVisitService } from './interfaces/IVisitService';
import { IVisitRepository } from '../repositories/interfaces/IVisitRepository';
import { VisitRepository } from '../repositories/VisitRepository';

export class VisitService implements IVisitService {
  private visitRepository: IVisitRepository;

  constructor(visitRepository: IVisitRepository = new VisitRepository()) {
    this.visitRepository = visitRepository;
  }

  async scheduleVisit(visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string; id?: string | number }> {
    // Add any business logic here before calling the repository
    console.log('[VisitService] scheduleVisit:', visitData);
    return this.visitRepository.scheduleVisit(visitData);
  }

  async getVisitsByProperty(propertyId: string | number): Promise<any[]> {
    console.log('[VisitService] getVisitsByProperty:', propertyId);
    return this.visitRepository.getVisitsByProperty(propertyId);
  }

  async getVisitsByAgent(agentId?: string): Promise<any[]> {
    console.log('[VisitService] getVisitsByAgent:', agentId);
    return this.visitRepository.getVisitsByAgent(agentId);
  }

  async getVisitsByBuyer(buyerId?: string): Promise<any[]> {
    console.log('[VisitService] getVisitsByBuyer:', buyerId);
    return this.visitRepository.getVisitsByBuyer(buyerId);
  }

  async getVisitById(visitId: string | number): Promise<any> {
    console.log('[VisitService] getVisitById:', visitId);
    return this.visitRepository.getVisitById(visitId);
  }

  async updateVisit(visitId: string | number, visitData: Partial<VisitDTO>): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitService] updateVisit:', visitId, visitData);
    return this.visitRepository.updateVisit(visitId, visitData);
  }

  async cancelVisit(visitId: string | number): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitService] cancelVisit:', visitId);
    return this.visitRepository.cancelVisit(visitId);
  }

  async confirmVisit(visitId: string | number): Promise<{ success: boolean; message?: string }> {
    console.log('[VisitService] confirmVisit:', visitId);
    return this.visitRepository.confirmVisit(visitId);
  }
}