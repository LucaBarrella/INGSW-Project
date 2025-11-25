export interface VisitRequest {
  id: number;
  address: string;
  date: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "DELETED";
}
