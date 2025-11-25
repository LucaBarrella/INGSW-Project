import { PagedVisitsDTO } from "@/src/dto/response/PagedVisitsDTO";

export interface IVisitService {
  getVisitsByBuyer(buyerId?: string): Promise<PagedVisitsDTO>;
  getVisitsOfCurrentAgent(): Promise<PagedVisitsDTO>;
}