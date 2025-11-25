export interface VisitDTO {
  visit: {
    id: number;
    createdAt: [number, number, number, number, number];
    startTime: number;
    endTime: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELETED';
  },
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | 'INDUSTRIAL';
  address: {
    id: number;
    country: string;
    province: string;
    city: string;
    street: string;
    streetNumber: string;
    building: string | null;
    latitude: number;
    longitude: number;
  }
}