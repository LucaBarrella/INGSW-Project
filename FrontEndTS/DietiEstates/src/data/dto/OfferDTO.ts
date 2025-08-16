export interface OfferDTO {
  id: string;
  propertyId: string;
  buyerId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}