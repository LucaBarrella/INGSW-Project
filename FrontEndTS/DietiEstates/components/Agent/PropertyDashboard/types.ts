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
  address: string;
  type: keyof Omit<PropertyFilters, "general">; // 'residential', 'commercial', 'industrial', 'land'
  price: number; // Prezzo come numero
  status: "under construction" | "new" | "renovated" | "good condition" | "to be renovated" | "poor condition"; // Stato dell'immobile
  createdAt: string; // Data di creazione (ISO string)
  imageUrl?: string; // URL dell'immagine principale (opzionale)
  images?: string[]; // Array di URL immagini
  
  contractType: 'rent' | 'sale';
  area: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  description?: string; // Aggiunta descrizione completa

  agent_id: number;
  address_id: number;
  features?: string[];
  yearBuilt?: number;
  energyRating?: string;
}

export interface PropertyDetail extends PropertyDTO {
  
  agent?: {
    id: number;
    name: string;
    contact: string;
    profileImageUrl?: string;
    agencyName?: string;
  };
  
  latitude?: number;
  longitude?: number;

  // Dettagli specifici per categoria, allineati con PropertyFilters
  propertyDetails?: {
    residential?: Partial<PropertyFilters['residential']>;
    commercial?: Partial<PropertyFilters['commercial']>;
    industrial?: Partial<PropertyFilters['industrial']>;
    land?: Partial<PropertyFilters['land']>;
  };
}