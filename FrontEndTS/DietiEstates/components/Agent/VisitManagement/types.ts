export interface VisitRequest {
  id: number;
  address: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
}
