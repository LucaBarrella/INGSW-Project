import { VisitRequest } from "@/src/dto/agenda";
import { PagedVisitsDTO } from "@/src/dto/response/PagedVisitsDTO";

export interface IVisitService {
  getVisitsByBuyer(buyerId?: string): Promise<PagedVisitsDTO>;
  getVisitsOfCurrentAgent(date: Date): Promise<{pending: VisitRequest[], confirmed: VisitRequest[]}>;
  updateVisitStatus(visitId: string | number, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "PENDING"): Promise<{ success: boolean; message?: string }>;
  createVisit(propertyId: number, agentId: number, startTime: string, endTime: string): Promise<{ success: boolean; message?: string }>;
}