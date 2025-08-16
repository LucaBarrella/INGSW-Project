export interface Offer {
  id: string;
  propertyId: string;
  buyerId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}