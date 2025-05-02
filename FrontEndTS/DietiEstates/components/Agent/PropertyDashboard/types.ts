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
  type: string; // Tipo di proprietà (Villa, Appartamento, etc.)
  price: string; // Prezzo come stringa
  views: number; // Numero di visualizzazioni
  bookings: number; // Numero di prenotazioni/visite
  status: "available" | "sold" | "rented"; // Stato dell'immobile
  createdAt: string; // Data di creazione (ISO string)
  updatedAt: string; // Data ultimo aggiornamento (ISO string)
  imageUrl?: string; // URL dell'immagine principale (opzionale)
}
