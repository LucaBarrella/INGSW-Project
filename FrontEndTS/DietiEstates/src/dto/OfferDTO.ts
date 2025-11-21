export interface OfferDTO {
    id: string;
    propertyId: string;
    buyerId: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }