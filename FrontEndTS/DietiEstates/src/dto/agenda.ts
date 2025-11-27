// Tipo di appuntamento per la colorazione
export type AppointmentType = 'standard' | 'group' | 'conflict' | 'extended';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  address: string;
  imageUrl?: string;
  addressId: number;
}

export interface UserInfo {
  id?: number;
  fullName: string;
  email: string;
}

export interface VisitRequest {
  id: number;
  property: Property;
  potentialClients: UserInfo[];
  startTime: Date;
  endTime: Date;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  isGroupOpportunity?: boolean;
  conflict?: Conflict;
  userInfo: UserInfo;
}

export interface Conflict {
  conflictingAppointmentId: number;
}