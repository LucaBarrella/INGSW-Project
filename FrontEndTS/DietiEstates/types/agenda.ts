// Stato di una richiesta o appuntamento
export type Status = 'pending' | 'confirmed' | 'declined' | 'conflicting';

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
}

export interface Appointment {
  id: string;
  property: Property;
  client: User;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  type: AppointmentType;
  notes?: string;
}

export interface VisitRequest {
  id: string;
  property: Property;
  potentialClients: User[];
  requestedTime: Date;
  status: Status;
  isGroupOpportunity?: boolean;
  conflict?: Conflict;
}

export interface Conflict {
  conflictingAppointmentId: string;
  reason: string; // Es. "Orario sovrapposto"
}