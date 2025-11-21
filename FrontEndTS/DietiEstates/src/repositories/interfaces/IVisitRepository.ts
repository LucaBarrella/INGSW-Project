import { PagedVisitsDTO } from "@/src/dto/response/PagedVisitsDTO";

export interface IVisitRepository {
  getVisitsByBuyer(): Promise<PagedVisitsDTO>;
}