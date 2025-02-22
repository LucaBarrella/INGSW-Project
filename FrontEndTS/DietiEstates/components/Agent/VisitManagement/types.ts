export interface VisitRequest {
  id: number;
  clientName: string;
  date: string;
  status: "pending" | "accepted" | "rejected" | "deleted";
  propertyId: string;
}
