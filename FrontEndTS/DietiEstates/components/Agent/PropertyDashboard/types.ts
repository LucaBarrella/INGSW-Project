import { PropertyFilters } from '../../Buyer/SearchIntegration/types'; // Importa PropertyFilters

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

export type PropertyCondition = "UNDER_CONSTRUCTION" | "NEW" | "RENOVATED" | "GOOD_CONDITION" | "TO_BE_RENOVATED" | "POOR_CONDITION"; 

export type EnergyRating = 'A4' | 'A3' | 'A2' | 'A1' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'NOT_APPLIABLE';

export interface PropertyDTO {
  id: number;
  address: {
    city: string;
    province: string;
    country: string;
    street: string;
    streetNumber: string;
    longitude?: number;
    latitude?: number;
  };
  views?: number;
  bookings?: number;
  latitude?: number;
  longitude?: number;
  type: keyof Omit<PropertyFilters, "general">; // 'residential', 'commercial', 'industrial', 'land'
  propertyCategory: string;
  price: number; // Prezzo come numero
  condition: PropertyCondition;
  createdAt: number[]; // Data di creazione
  updatedAt: number[]; // Data di aggiornamento
  imageUrl?: string; // URL dell'immagine principale (opzionale)
  firstImageUrl?: string; // Campo per la prima immagine dalla ricerca
  images?: string[]; // Array di URL immagini
  
  contractType: 'rent' | 'sale';
  area: number;
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
    },
    email?: string;
  };
}

export interface PropertyDetail extends PropertyDTO {

  agentFullName?: string;

  // Dettagli specifici per categoria, allineati con PropertyFilters
  propertyDetails?: {
    residential?: Partial<PropertyFilters['residential']>;
    commercial?: Partial<PropertyFilters['commercial']>;
    land?: Partial<PropertyFilters['land']>;
  };
}