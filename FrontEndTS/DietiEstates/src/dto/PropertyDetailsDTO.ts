import { PropertyCondition } from '@/components/Agent/PropertyDashboard/types';
import { PropertyFilters } from './SearchDTO';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DashboardStats {
  totalProperties: number;
  soldProperties: number;
  rentedProperties: number;
  activeListings: number;
  averagePrice: number;
  monthlyViews: number;
  totalBookings: number;
  averageBookingsPerProperty: number;
}

export interface PropertyDTO {
  id: number;
  address: {
    city: string;
  };
  views?: number;
  bookings?: number;
  latitude?: number;
  longitude?: number;
  type: keyof Omit<PropertyFilters, "general">; // 'residential', 'commercial', 'garage', 'land'
  propertyCategory: string;
  price: number; // Prezzo come numero
  status: PropertyCondition;
  createdAt: string; // Data di creazione (ISO string)
  imageUrl?: string; // URL dell'immagine principale (opzionale)
  images?: string[]; // Array di URL immagini
  
  contractType: 'rent' | 'sale';
  area: number;
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  description?: string; // Aggiunta descrizione completa

  id_agent: number;
  id_address: number;
  features?: string[];
  yearBuilt?: number;
  energyRating?: string;

  agent: {
    id: number;
    firstName: string;
    lastName: string;
    contact: string;
    profileImageUrl?: string;
    agency?: {
      name: string;
    }
  };
}

export interface PropertyDetailDTO extends PropertyDTO {

  agentFullName?: string;

  // Dettagli specifici per categoria, allineati con PropertyFilters
  propertyDetails?: {
    residential?: Partial<PropertyFilters['residential']>;
    commercial?: Partial<PropertyFilters['commercial']>;
    garage?: Partial<PropertyFilters['garage']>;
    land?: Partial<PropertyFilters['land']>;
  };
}