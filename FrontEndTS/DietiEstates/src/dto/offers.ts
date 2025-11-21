/**
 * Rappresenta lo stato di un'offerta.
 */
export enum OfferStatus {
  Active = 'active',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Archived = 'archived', // Stato per offerte cancellate dalla vista dell'agente
}

/**
 * Rappresenta l'acquirente che ha effettuato l'offerta.
 */
export interface Buyer {
  id: string;
  name: string;
  // Altre informazioni pertinenti sull'acquirente (es. email, telefono)
  // verranno aggiunte qui se necessario.
}

/**
 * Rappresenta una singola offerta per un immobile.
 */
export interface Offer {
  id: string;
  amount: number;
  status: OfferStatus;
  buyer: Buyer;
  createdAt: string; // ISO 8601 date string
}

/**
 * Rappresenta un immobile con le relative offerte.
 * Questo è il modello di dati principale per la schermata "Offerte".
 */
export interface PropertyWithOffers {
  id: string;
  address: string;
  imageUrl: string;
  offers: Offer[];
}