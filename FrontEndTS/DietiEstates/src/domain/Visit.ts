export interface Visit {
  id: string;
  propertyId: string;
  buyerId: string;
  agentId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}