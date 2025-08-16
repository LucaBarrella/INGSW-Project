// Interfaccia per i dettagli della proprietà restituiti dall'API
// Estende PropertyDetail per includere campi specifici del dominio se necessario
// o definisce una struttura più generica che il mapper può gestire.
export interface ApiPropertyDetail {
  id: string | number;
  title: string;
  description: string;
  address: any; // O una definizione più specifica se disponibile
  price: number;
  agentId: string; // Assumendo che l'API fornisca agentId direttamente
  status: string;
  createdAt: string;
  updatedAt: string;
  // Altri campi potrebbero essere presenti, ma questi sono essenziali per il mapper
  // Se l'API restituisce un oggetto 'agent' invece di 'agentId', adattare il mapper o l'interfaccia
  // agent?: { id: string; firstName: string; lastName: string };
}

// Interfaccia per i filtri di ricerca delle proprietà
// Deve corrispondere a ciò che l'API si aspetta, che potrebbe essere diverso da PropertyFilters del dominio
export interface ApiPropertyFilters {
  general?: {
    transactionType?: string;
    priceRange?: { min?: number; max?: number };
    size?: { min?: number; max?: number };
  };
  // L'API potrebbe non richiedere tutte le categorie specifiche come PropertyFilters
  // oppure potrebbe avere una struttura diversa. Adattare in base alla documentazione API.
  // Per ora, manteniamo una struttura più generica.
  // Se l'API si aspetta categorie specifiche, aggiungerle qui.
  // residential?: { rooms?: string; bathrooms?: string; /* ... */ };
  // commercial?: { /* ... */ };
  // industrial?: { /* ... */ };
  // land?: { /* ... */ };
}