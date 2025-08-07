import { PropertyDetail, DashboardStats } from '@/components/Agent/PropertyDashboard/types';
// PropertyType non è più necessario qui se PropertyDetail.type è ora più specifico
// import { PropertyType } from '@/components/Agent/AddPropertySteps/Step1_PropertyType';

// --- DATI MOCK ---
export const DEFAULT_MOCK_DELAY_MS = 500; // Simula un ritardo di rete

export const mockDelay = <T>(data: T, delayMs: number = DEFAULT_MOCK_DELAY_MS): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delayMs));

export const MOCK_TOKEN_RESPONSE = { token: 'mock-jwt-token-12345', userType: 'buyer' };
export const MOCK_SUCCESS_RESPONSE = { status: 200, success: true, message: 'Operazione completata con successo (Mock)' };
export const MOCK_AGENT_PROFILE = { fullName: 'Mario Rossi (Mock)', email: 'mock.agent@dietiestates.it', licenseNumber: 'REA-MOCK-123' };

export const MOCK_AGENT_STATS: DashboardStats = {
  totalProperties: 25, // Aggiornato per riflettere i nuovi immobili
  soldProperties: 4,   // Aggiornato
  rentedProperties: 3, // Aggiornato
  activeListings: 18,  // Aggiornato
  averagePrice: 380000, // Potrebbe essere ricalcolato
  monthlyViews: 3500,
  totalBookings: 65,
  averageBookingsPerProperty: 2.6, // Potrebbe essere ricalcolato
};

export const MOCK_PROPERTIES: PropertyDetail[] = [
  {
    id: 1,
    address: 'Via dei Giardini 1, Como',
    price: 750000,
    status: 'good condition',
    createdAt: new Date(2024, 3, 15).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/villa1/800/600',
    images: ['https://picsum.photos/seed/villa1/800/600', 'https://picsum.photos/seed/villa1_int/800/600'],
    contractType: 'sale',
    area: 320,
    numberOfBedrooms: 4,
    numberOfBathrooms: 3,
    description: 'Magnifica villa con piscina privata, ampio giardino e finiture di pregio, situata in una zona residenziale esclusiva di Como. Ideale per famiglie che cercano comfort e privacy.',
    agent: { id: 1, name: 'Giovanni Storti', contact: 'g.storti@example.com', agencyName: "Dieti Estates Como" },
    id_agent: 1,
    features: ['Piscina', 'Giardino Privato', 'Aria Condizionata', 'Sistema di Allarme', 'Garage Doppio'],
    yearBuilt: 2018,
    energyRating: 'A+',
    latitude: 45.8100,
    longitude: 9.0863,
    id_address: 1,
    propertyDetails: {
      residential: {
        category: 'Villa',
        rooms: '7',
        floor: 'Su più livelli',
        elevator: false,
        pool: true,
      }
    }
  },
  {
    id: 2,
    address: 'Corso Italia 45, Milano',
    price: 4500, // Affitto mensile
    status: 'under construction',
    createdAt: new Date(2024, 4, 1).toISOString(),
    type: 'commercial',
    imageUrl: 'https://picsum.photos/seed/commercial1/800/600',
    images: ['https://picsum.photos/seed/commercial1/800/600'],
    contractType: 'rent',
    area: 120,
    numberOfBathrooms: 1,
    description: 'Negozio con ottima visibilità in pieno centro a Milano, ideale per attività commerciali di prestigio. Ristrutturato di recente.',
    agent: { id: 2, name: 'Marina Massironi', contact: 'm.massironi@example.com', agencyName: "Dieti Estates Milano" },
    features: ['Vetrine su strada', 'Ristrutturato', 'Posizione Centrale'],
    yearBuilt: 1960,
    energyRating: 'D',
    latitude: 45.4654219,
    longitude: 9.1859243,
    propertyDetails: {
      commercial: {
        category: 'Negozio',
        bathrooms: '1', // Già presente bathrooms a livello superiore, ma mantenuto per coerenza con la struttura esistente
        emergencyExit: true,
        // constructionDate: '1960', // Rimosso perché yearBuilt è a livello superiore
      }
    },
    id_agent: 2,
    id_address: 2
  },
  {
    id: 3,
    address: 'Zona Industriale 3, Bergamo',
    price: 1200000,
    status: 'new',
    createdAt: new Date(2024, 2, 10).toISOString(),
    type: 'industrial',
    imageUrl: 'https://picsum.photos/seed/industrial1/800/600',
    images: ['https://picsum.photos/seed/industrial1/800/600', 'https://picsum.photos/seed/industrial1_int/800/600'],
    contractType: 'sale',
    area: 1500,
    description: 'Capannone industriale di recente costruzione, con ampi spazi, uffici e area carico/scarico. Facilmente accessibile dalle principali vie di comunicazione.',
    agent: { id: 1, name: 'Giovanni Storti', contact: 'g.storti@example.com', agencyName: "Dieti Estates Bergamo" }, // Aggiunto agencyName
    features: ['Area Carico/Scarico', 'Uffici', 'Ampio Parcheggio'],
    yearBuilt: 2015,
    latitude: 45.6983,
    longitude: 9.6773,
    propertyDetails: {
      industrial: {
        category: 'Capannone',
        ceilingHeight: '10m',
        fireSystem: true,
        floorLoad: '5000kg/mq',
        offices: '4',
        structure: 'Cemento Armato',
      }
    },
    id_agent: 1,
    id_address: 3
  },
  // ...existing code...
  {
    id: 4,
    address: 'Via delle Querce 78, Monza',
    price: 350000,
    status: 'new',
    createdAt: new Date(2024, 2, 20).toISOString(),
    type: 'land',
    imageUrl: 'https://picsum.photos/seed/land1/800/600',
    images: ['https://picsum.photos/seed/land1/800/600'],
    contractType: 'sale',
    area: 2000,
    description: 'Terreno edificabile in posizione collinare e panoramica, ideale per la costruzione di una villa unifamiliare o bifamiliare.',
    agent: { id: 3, name: 'Giacomo Poretti', contact: 'g.poretti@example.com', agencyName: "Dieti Estates Brianza" },
    id_agent: 3,
    id_address: 4,
    features: ['Vista Panoramica', 'Zona Residenziale', 'Progetto Approvabile'],
    latitude: 45.5850,
    longitude: 9.2730,
    propertyDetails: {
      land: {
        category: 'Edificabile',
        soilType: 'Sabbioso-Argilloso',
        slope: '10%',
      }
    }
  },
  {
    id: 5,
    address: 'Via Roma 101, Firenze',
    price: 1200,
    status: 'good condition',
    createdAt: new Date(2024, 5, 1).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/aptfirenze/800/600',
    images: ['https://picsum.photos/seed/aptfirenze/800/600', 'https://picsum.photos/seed/aptfirenze_int/800/600'],
    contractType: 'rent',
    area: 85,
    numberOfBedrooms: 2,
    numberOfBathrooms: 1,
    description: 'Luminoso appartamento trilocale completamente ristrutturato, situato in zona centrale e ben servita. Contratto transitorio o 4+4.',
    agent: { id: 2, name: 'Marina Massironi', contact: 'm.massironi@example.com', agencyName: "Dieti Estates Firenze" },
    id_agent: 2,
    id_address: 5,
    features: ['Balcone', 'Aria Condizionata', 'Ristrutturato', 'Ascensore'],
    yearBuilt: 1970,
    energyRating: 'E',
    latitude: 43.7714,
    longitude: 11.2546,
    propertyDetails: {
      residential: {
        category: 'Appartamento',
        rooms: '3',
        floor: '2',
        elevator: true,
        pool: false,
      }
    }
  },
  {
    id: 6,
    address: 'Via Nuova 10, Napoli',
    price: 250000,
    status: 'good condition',
    createdAt: new Date(2024, 1, 10).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/aptnapoli/800/600',
    images: ['https://picsum.photos/seed/aptnapoli/800/600', 'https://picsum.photos/seed/aptnapoli_int/800/600'],
    contractType: 'sale',
    area: 90,
    numberOfBedrooms: 2,
    numberOfBathrooms: 1,
    description: "Appartamento luminoso in zona centrale a Napoli, vicino alla metropolitana e ai principali servizi. Ottime condizioni interne.",
    agent: { id: 3, name: 'Giacomo Poretti', contact: 'g.poretti@example.com', agencyName: "Dieti Estates Napoli" },
    id_agent: 3,
    id_address: 6,
    features: ['Balcone', 'Ristrutturato di recente', 'Vicino Metro'],
    yearBuilt: 1980,
    energyRating: 'C',
    latitude: 40.8518,
    longitude: 14.2681,
    propertyDetails: {
      residential: {
        category: 'Appartamento',
        rooms: '3',
        floor: '3',
        elevator: true,
        pool: false,
      }
    }
  },
  {
    id: 7,
    address: 'Piazza Affari 5, Milano',
    price: 3000,
    status: 'new',
    createdAt: new Date(2024, 3, 5).toISOString(),
    type: 'commercial',
    imageUrl: 'https://picsum.photos/seed/uffmilano/800/600',
    images: ['https://picsum.photos/seed/uffmilano/800/600', 'https://picsum.photos/seed/uffmilano_int/800/600'],
    contractType: 'rent',
    area: 150,
    numberOfBathrooms: 2,
    description: "Ufficio prestigioso in Piazza Affari, completamente cablato e pronto all'uso. Ideale per società di rappresentanza.",
    agent: { id: 2, name: 'Marina Massironi', contact: 'm.massironi@example.com', agencyName: "Dieti Estates Milano" },
    id_agent: 2,
    id_address: 7,
    features: ['Reception', 'Sale Riunioni', 'Cablato', 'Aria Condizionata Centralizzata'],
    yearBuilt: 2005,
    energyRating: 'B',
    latitude: 45.4642,
    longitude: 9.1800,
    propertyDetails: {
      commercial: {
        category: 'Ufficio',
        bathrooms: '2',
        emergencyExit: true,
      }
    }
  },
  {
    id: 8,
    address: 'Via della Logistica 12, Bologna',
    price: 950000,
    status: 'good condition',
    createdAt: new Date(2023, 11, 20).toISOString(),
    type: 'industrial',
    imageUrl: 'https://picsum.photos/seed/magbologna/800/600',
    images: ['https://picsum.photos/seed/magbologna/800/600', 'https://picsum.photos/seed/magbologna_int/800/600'],
    contractType: 'sale',
    area: 2000,
    description: "Ampio magazzino con zona uffici e piazzale di manovra, vicino all'autostrada. Ottimo per logistica e stoccaggio.",
    agent: { id: 1, name: 'Giovanni Storti', contact: 'g.storti@example.com', agencyName: "Dieti Estates Bologna" },
    id_agent: 1,
    id_address: 8,
    features: ['Piazzale Esterno', 'Baie di Carico', 'Uffici Inclusi', 'Accesso Autostradale'],
    yearBuilt: 2010,
    energyRating: 'In fase di definizione',
    latitude: 44.5069,
    longitude: 11.3426,
    propertyDetails: {
      industrial: {
        category: 'Magazzino',
        ceilingHeight: '8m',
        fireSystem: true,
        floorLoad: '3000kg/mq',
        offices: '3',
        structure: 'Prefabbricato in CA',
      }
    }
  },
  {
    id: 9,
    address: 'Contrada Sole 1, Lecce',
    price: 80000,
    status: 'to be renovated',
    createdAt: new Date(2024, 0, 15).toISOString(),
    type: 'land',
    imageUrl: 'https://picsum.photos/seed/terlecce/800/600',
    images: ['https://picsum.photos/seed/terlecce/800/600'],
    contractType: 'sale',
    area: 10000,
    description: "Terreno agricolo pianeggiante, ideale per coltivazioni o uliveto. Accesso diretto da strada comunale.",
    agent: { id: 3, name: 'Giacomo Poretti', contact: 'g.poretti@example.com', agencyName: "Dieti Estates Salento" },
    id_agent: 3,
    id_address: 9,
    features: ['Pianeggiante', 'Accesso Stradale', 'Irrigabile'],
    latitude: 40.3515,
    longitude: 18.1750,
    propertyDetails: {
      land: {
        category: 'Coltivabile',
        soilType: 'Argilloso-Calcareo',
        slope: '2%',
      }
    }
  },
  {
    id: 10,
    address: 'Viale dei Pini 25, Roma',
    price: 4500,
    status: 'good condition',
    createdAt: new Date(2024, 4, 12).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/villaroma/800/600',
    images: ['https://picsum.photos/seed/villaroma/800/600', 'https://picsum.photos/seed/villaroma_int1/800/600', 'https://picsum.photos/seed/villaroma_int2/800/600'],
    contractType: 'rent',
    area: 280,
    numberOfBedrooms: 5,
    numberOfBathrooms: 4,
    description: "Elegante villa con giardino curato e piscina in zona residenziale tranquilla di Roma Nord. Finiture di lusso.",
    agent: { id: 1, name: 'Giovanni Storti', contact: 'g.storti@example.com', agencyName: "Dieti Estates Roma" },
    id_agent: 1,
    id_address: 10,
    features: ['Piscina Privata', 'Ampio Giardino', 'Camino Funzionante', 'Sistema di Allarme Perimetrale', 'Garage Triplo'],
    yearBuilt: 1995,
    energyRating: 'B',
    latitude: 41.9028,
    longitude: 12.4964,
    propertyDetails: {
      residential: {
        category: 'Villa',
        rooms: '8',
        floor: 'Su due livelli',
        elevator: false,
        pool: true,
      }
    }
  },
  {
    id: 11,
    address: 'Via Garibaldi 7, Torino',
    price: 120000,
    status: 'new',
    createdAt: new Date(2023, 9, 1).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/studiotorino/800/600',
    images: ['https://picsum.photos/seed/studiotorino/800/600'],
    contractType: 'sale',
    area: 40,
    numberOfBedrooms: 0,
    numberOfBathrooms: 1,
    description: "Monolocale finemente ristrutturato nel cuore di Torino, ottimo come investimento o pied-à-terre. Venduto.",
    agent: { id: 2, name: 'Marina Massironi', contact: 'm.massironi@example.com', agencyName: "Dieti Estates Torino" },
    id_agent: 2,
    id_address: 11,
    features: ['Ristrutturato', 'Posizione Centrale', 'Basse Spese Condominiali'],
    yearBuilt: 1960,
    energyRating: 'F',
    latitude: 45.0703,
    longitude: 7.6869,
    propertyDetails: {
      residential: {
        category: 'Appartamento',
        rooms: '1',
        floor: '1',
        elevator: false,
        pool: false,
      }
    }
  },
  {
    id: 12,
    address: 'Corso Umberto I 150, Palermo',
    price: 350000,
    status: 'good condition',
    createdAt: new Date(2024, 2, 22).toISOString(),
    type: 'commercial',
    imageUrl: 'https://picsum.photos/400/300.webp',
    images: ['https://picsum.photos/400/300.webp'],
    contractType: 'sale',
    area: 80,
    numberOfBathrooms: 1,
    description: "Negozio in via di forte passaggio pedonale a Palermo, con due ampie vetrine su strada. Buone condizioni generali.",
    agent: { id: 3, name: 'Giacomo Poretti', contact: 'g.poretti@example.com', agencyName: "Dieti Estates Palermo" },
    id_agent: 3,
    id_address: 12,
    features: ['Due Vetrine', 'Alta Visibilità', 'Serranda Elettrica'],
    yearBuilt: 1975,
    energyRating: 'G',
    latitude: 38.1157,
    longitude: 13.3615,
    propertyDetails: {
      commercial: {
        category: 'Negozio',
        bathrooms: '1',
        emergencyExit: false,
      }
    }
  },
  {
    id: 13,
    address: 'Lungarno Vespucci 1, Firenze',
    price: 1200000,
    status: 'good condition',
    createdAt: new Date(2024, 0, 30).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/atticofirenze/800/600',
    images: ['https://picsum.photos/seed/atticofirenze/800/600', 'https://picsum.photos/seed/atticofirenze_terrazza/800/600'],
    contractType: 'sale',
    area: 180,
    numberOfBedrooms: 3,
    numberOfBathrooms: 3,
    description: "Attico di lusso con terrazza panoramica sull'Arno e vista Duomo. Finiture di pregio e design moderno.",
    agent: { id: 1, name: 'Giovanni Storti', contact: 'g.storti@example.com', agencyName: "Dieti Estates Firenze" },
    id_agent: 1,
    id_address: 13,
    features: ['Terrazza Panoramica', 'Vista Arno', 'Aria Condizionata Canalizzata', 'Domotica', 'Ascensore Privato'],
    yearBuilt: 2015,
    energyRating: 'A',
    latitude: 43.7731,
    longitude: 11.2451,
    propertyDetails: {
      residential: {
        category: 'Attico',
        rooms: '5',
        floor: '5 (ultimo)',
        elevator: true,
        pool: false,
      }
    }
  },
  {
    id: 14,
    address: 'Via Panoramica 22, Trento',
    price: 280000,
    status: 'new',
    createdAt: new Date(2023, 10, 10).toISOString(),
    type: 'land',
    imageUrl: 'https://picsum.photos/seed/terrentrento/800/600',
    images: ['https://picsum.photos/seed/terrentrento/800/600'],
    contractType: 'sale',
    area: 1500,
    description: "Terreno edificabile con splendida vista sulle montagne circostanti, ideale per la costruzione di una villa singola o bifamiliare.",
    agent: { id: 2, name: 'Marina Massironi', contact: 'm.massironi@example.com', agencyName: "Dieti Estates Trentino" },
    id_agent: 2,
    id_address: 14,
    features: ['Vista Montagne', 'Zona Residenziale Esclusiva', 'Progetto Approvato (opzionale)'],
    latitude: 46.0667,
    longitude: 11.1167,
    propertyDetails: {
      land: {
        category: 'Edificabile',
        soilType: 'Misto Roccioso',
        slope: '15%',
      }
    }
  },
  {
    id: 15,
    address: 'Via Indipendenza 50, Bologna',
    price: 900,
    status: 'new',
    createdAt: new Date(2023, 8, 15).toISOString(),
    type: 'residential',
    imageUrl: 'https://picsum.photos/seed/aptbologna/800/600',
    images: ['https://picsum.photos/seed/aptbologna/800/600', 'https://picsum.photos/seed/aptbologna_int/800/600'],
    contractType: 'rent',
    area: 70,
    numberOfBedrooms: 2,
    numberOfBathrooms: 1,
    description: "Trilocale accogliente e funzionale in zona universitaria, comodo a tutti i servizi. Attualmente affittato a studenti con ottima rendita.",
    agent: { id: 3, name: 'Giacomo Poretti', contact: 'g.poretti@example.com', agencyName: "Dieti Estates Bologna" },
    id_agent: 3,
    id_address: 15,
    features: ['Arredato', 'Vicino Università', 'Termoautonomo', 'Balcone'],
    yearBuilt: 1970,
    energyRating: 'E',
    latitude: 44.4988,
    longitude: 11.3420,
    propertyDetails: {
      residential: {
        category: 'Appartamento',
        rooms: '3',
        floor: '2',
        elevator: false,
        pool: false,
      }
    }
  }
];

export const MOCK_FEATURED_PROPERTIES: PropertyDetail[] = MOCK_PROPERTIES.slice(0, 4); // Aggiornato per prendere i primi 4
// Assicurati che MOCK_PROPERTY_DETAILS sia un oggetto completo e valido di tipo PropertyDetail
export const MOCK_PROPERTY_DETAILS: PropertyDetail = { ...MOCK_PROPERTIES[0] };
