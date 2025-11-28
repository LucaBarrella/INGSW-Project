import { UserInfo } from "./agenda";

export interface VisitDTO {
  visit: {
    id: number;
    createdAt: [number, number, number, number, number];
    startTime: number;
    endTime: number;
    status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  },
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND' | 'GARAGE';
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
  },
  userInfo: UserInfo;
}