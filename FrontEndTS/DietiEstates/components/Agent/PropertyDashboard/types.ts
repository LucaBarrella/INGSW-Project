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

export interface PropertyDetail {
  id: number;
  title: string;
  address: string;
  type: keyof Omit<PropertyFilters, "general">; // 'residential', 'commercial', 'industrial', 'land'
  price: number; // Prezzo come numero
  views?: number; // Numero di visualizzazioni (opzionale)
  bookings?: number; // Numero di prenotazioni/visite (opzionale)
  status: "available" | "sold" | "rented" | "unavailable"; // Stato dell'immobile
  createdAt: string; // Data di creazione (ISO string)
  updatedAt: string; // Data ultimo aggiornamento (ISO string)
  imageUrl?: string; // URL dell'immagine principale (opzionale)
  images?: string[]; // Array di URL immagini
  
  transactionType: 'rent' | 'sale';
  squareMeters: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string; // Aggiunta descrizione completa

  agent?: {
    id: string;
    name: string;
    contact: string;
    profileImageUrl?: string;
    agencyName?: string;
  };
  features?: string[];
  yearBuilt?: number;
  energyRating?: string;
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
