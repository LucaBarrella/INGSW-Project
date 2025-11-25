import { IVisitRepository } from './interfaces/IVisitRepository';
import VisitApiService from '../api/VisitApi';
import { PagedVisitsDTO } from '../dto/response/PagedVisitsDTO';

export class VisitRepository implements IVisitRepository {
  async getVisitsByBuyer(): Promise<PagedVisitsDTO> {
    return VisitApiService.getVisitsByBuyer();
  }

  async getVisitsOfCurrentAgent(): Promise<PagedVisitsDTO> {
    return VisitApiService.getVisitsOfCurrentAgent();
  }

  async updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }> {
    return VisitApiService.updateVisitStatus(visitId, status);
  }
}