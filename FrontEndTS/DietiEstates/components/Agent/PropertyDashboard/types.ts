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

export interface PropertyDTO {
  id: number;
  address: {
    city: string;
  };
  latitude?: number;
  longitude?: number;
  type: keyof Omit<PropertyFilters, "general">; // 'residential', 'commercial', 'industrial', 'land'
  propertyCategory: string;
  price: number; // Prezzo come numero
  status: "UNDER_CONSTRUCTION" | "NEW" | "RENOVATED" | "GOOD_CONDITION" | "TO_BE_RENOVATED" | "POOR_CONDITION"; // Stato dell'immobile
  createdAt: string; // Data di creazione (ISO string)
  imageUrl?: string; // URL dell'immagine principale (opzionale)
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
    }
  };
}

export interface PropertyDetail extends PropertyDTO {

  agentFullName?: string;

  // Dettagli specifici per categoria, allineati con PropertyFilters
  propertyDetails?: {
    residential?: Partial<PropertyFilters['residential']>;
    commercial?: Partial<PropertyFilters['commercial']>;
    industrial?: Partial<PropertyFilters['industrial']>;
    land?: Partial<PropertyFilters['land']>;
  };
}