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
}