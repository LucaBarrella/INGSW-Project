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
}