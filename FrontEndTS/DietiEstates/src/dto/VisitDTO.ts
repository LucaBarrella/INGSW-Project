export interface VisitDTO {
    id: string;
    propertyId: string;
    buyerId: string;
    agentId: string;
    scheduledDate: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }