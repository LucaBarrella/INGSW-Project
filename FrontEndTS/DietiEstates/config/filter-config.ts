import { FilterDefinition, CategoryFilterMap } from '@/components/Buyer/SearchIntegration/types';
 
export const ALL_FILTERS: { [key: string]: FilterDefinition } = {
  // Filtri generali
  contract: {
    key: 'contract',
    label: 'Tipo di Transazione',
    control: 'SegmentedControl',
    // Allineato al DTO backend (valori in maiuscolo)
    options: ['RENT', 'SALE'],
    defaultValue: null
  },
  priceRange: {
    key: 'priceRange',
    label: 'Prezzo',
    control: 'RangeSlider',
    min: 0,
    max: 2000000,
    step: 50000,
    defaultValue: { min: 0, max: 500000 }
  },
  size: {
    key: 'size',
    label: 'Dimensione',
    control: 'RangeSlider',
    min: 20,
    max: 1000,
    step: 10,
    unit: 'm²',
    defaultValue: { min: 20, max: 200 }
  },
  // Raggio di ricerca (single-value slider) - mostrato sempre nei filtri generali
  searchRadiusKm: {
    key: 'searchRadiusKm',
    label: 'Raggio di ricerca (km)',
    control: 'RangeSlider',
    min: 1,
    max: 50,
    step: 1,
    unit: 'km',
    defaultValue: { min: 1, max: 20 }
  },
  // Riscaldamento: non è più un filtro generale perché non applica a tutte le tipologie (es. LAND)
  // Normalizziamo le opzioni per allinearle al DTO backend (Capitalized)
  heating: {
    key: 'heating',
    label: 'Riscaldamento',
    control: 'SegmentedControl',
    options: ['Centralized', 'Autonomous', 'Absent'],
    defaultValue: 'Absent',
    categorySpecific: true
  },

  // Filtri specifici per RESIDENTIAL
  minNumberOfRooms: {
    key: 'minNumberOfRooms',
    label: 'Numero minimo di camere',
    control: 'QuickNumericSelector',
    min: 1,
    max: 10,
    defaultValue: 1,
    categorySpecific: true
  },
  minNumberOfBathrooms: {
    key: 'minNumberOfBathrooms',
    label: 'Numero minimo di bagni',
    control: 'QuickNumericSelector',
    min: 1,
    max: 6,
    defaultValue: 1,
    categorySpecific: true
  },
  floor: {
    key: 'floor',
    label: 'Piano',
    control: 'QuickNumericSelector',
    min: 0,
    max: 50,
    defaultValue: 0,
    categorySpecific: true
  },
  minNumberOfFloors: {
    key: 'minNumberOfFloors',
    label: 'Numero minimo di piani',
    control: 'QuickNumericSelector',
    min: 1,
    max: 10,
    defaultValue: 1,
    categorySpecific: true
  },
  mustHaveElevator: {
    key: 'mustHaveElevator',
    label: 'Con ascensore',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  
  // Allineamento con API /properties/search
  // Anno minimo di costruzione (minYearBuilt)
  minYearBuilt: {
    key: 'minYearBuilt',
    label: 'Anno di costruzione minimo',
    control: 'QuickNumericSelector',
    min: 1800,
    max: new Date().getFullYear(),
    defaultValue: 1900,
  },

  // Numero minimo di posti auto (minParkingSpaces)
  minParkingSpaces: {
    key: 'minParkingSpaces',
    label: 'Posti auto minimi',
    control: 'QuickNumericSelector',
    min: 0,
    max: 20,
    defaultValue: 0,
    categorySpecific: true
  },

  // Stato/condizione accettata (acceptedCondition) - allineato con API (array di status possibili)
  acceptedCondition: {
    key: 'acceptedCondition',
    label: 'Condizione accettata',
    control: 'SegmentedControl',
    options: ['NEW', 'GOOD_CONDITION', 'RENOVATED', 'TO_BE_RENOVATED', 'POOR_CONDITION', 'UNDER_CONSTRUCTION'],
    // Il backend si aspetta una lista; usiamo array per coerenza con FilterRequest DTO
    defaultValue: ['GOOD_CONDITION'],
  },

  // Energia minima richiesta (minEnergyRating)
  minEnergyRating: {
    key: 'minEnergyRating',
    label: 'Classe energetica minima',
    control: 'SegmentedControl',
    // Allineato con API: includere A4 e A3 e NOT_APPLIABLE
    options: ['A4','A3','A2','A1','B','C','D','E','F','G','NOT_APPLIABLE'],
    defaultValue: 'C',
  },

  // Giardino accettato (acceptedGarden) -- mappa ai valori API
  acceptedGarden: {
    key: 'acceptedGarden',
    label: 'Giardino',
    control: 'SegmentedControl',
    options: ['PRIVATE','SHARED','ABSENT'],
    // Backend accetta una lista; il controllo UI è single-select -> default come stringa per compatibilità
    defaultValue: 'ABSENT',
    categorySpecific: true
  },

  // Arredato (mustBeFurnished / isFurnished)
  mustBeFurnished: {
    key: 'mustBeFurnished',
    label: 'Arredato',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },

  // Filtri specifici per COMMERCIAL
  mustHaveWheelchairAccess: {
    key: 'mustHaveWheelchairAccess',
    label: 'Accesso per disabili',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  mustHaveSurveillance: {
    key: 'mustHaveSurveillance',
    label: 'Sistema di sorveglianza',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  constructionYear: {
    key: 'constructionYear',
    label: 'Anno di costruzione',
    control: 'QuickNumericSelector',
    min: 1800,
    max: new Date().getFullYear(),
    defaultValue: 2000,
    categorySpecific: true
  },

  // Filtri specifici per GARAGE
  // Filtri specifici per LAND
  mustBeAccessibleFromStreet: {
    key: 'mustBeAccessibleFromStreet',
    label: 'Accesso stradale',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
};

export const CATEGORY_FILTERS: CategoryFilterMap = {
  RESIDENTIAL: [
    // Filtri specifici per residenziale (i filtri generali come price/size/contract sono mostrati separatamente)
    'heating',
    'minNumberOfRooms',
    'minNumberOfBathrooms',
    'floor',
    // Aggiunto: minNumberOfFloors è specificato nella API per RESIDENTIAL
    'minNumberOfFloors',
    'mustHaveElevator',
    'minParkingSpaces',
    'acceptedGarden',
    'mustBeFurnished'
  ],
  COMMERCIAL: [
    'minNumberOfFloors',
    'minNumberOfRooms',
    'minNumberOfBathrooms',
    'mustHaveWheelchairAccess'
  ],
  GARAGE: [
    // Garage non ha riscaldamento applicabile qui
    'mustHaveSurveillance',
    'minNumberOfFloors'
  ],
  LAND: [
    // Land non mostra filtri di riscaldamento
    'mustBeAccessibleFromStreet'
  ]
};