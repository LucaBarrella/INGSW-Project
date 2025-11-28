import { PagedVisitsDTO } from "@/src/dto/response/PagedVisitsDTO";

export interface IVisitRepository {
  getVisitsByBuyer(): Promise<PagedVisitsDTO>;
  getVisitsOfCurrentAgent(): Promise<PagedVisitsDTO>;
  updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }>;
  createVisit(propertyId: number, agentId: number, startTime: string, endTime: string): Promise<{ success: boolean; message?: string }>;
}