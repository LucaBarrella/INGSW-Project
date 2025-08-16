export interface VisitDTO {
  id: string;
  propertyId: string;
  buyerId: string;
  agentId: string;
  scheduledDate: string; // ISO 8601 date string
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}