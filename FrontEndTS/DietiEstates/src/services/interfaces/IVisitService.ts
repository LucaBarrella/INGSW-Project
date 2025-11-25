import { PagedVisitsDTO } from "@/src/dto/response/PagedVisitsDTO";

export interface IVisitService {
  getVisitsByBuyer(buyerId?: string): Promise<PagedVisitsDTO>;
  getVisitsOfCurrentAgent(): Promise<PagedVisitsDTO>;
  updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }>;
}