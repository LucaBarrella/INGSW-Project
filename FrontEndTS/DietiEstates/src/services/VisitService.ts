import { IVisitService } from './interfaces/IVisitService';
import { IVisitRepository } from '../repositories/interfaces/IVisitRepository';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';

export class VisitService implements IVisitService {
  private visitRepository: IVisitRepository;

  constructor(visitRepository: IVisitRepository) {
    this.visitRepository = visitRepository;
  }

  async getVisitsByBuyer(): Promise<PagedVisitsDTO> {
    return this.visitRepository.getVisitsByBuyer();
  }

  async getVisitsOfCurrentAgent(): Promise<PagedVisitsDTO> {
    return this.visitRepository.getVisitsOfCurrentAgent();
  }

  async updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }> {
    return this.visitRepository.updateVisitStatus(visitId, status);
  }
}