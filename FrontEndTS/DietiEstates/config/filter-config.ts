import { FilterDefinition, CategoryFilterMap } from '@/components/Buyer/SearchIntegration/types';
 
export const ALL_FILTERS: { [key: string]: FilterDefinition } = {
  // Filtri generali
  contract: {
    key: 'contract',
    label: 'Tipo di Transazione',
    control: 'SegmentedControl',
    options: ['sale', 'rent'],
    defaultValue: 'sale'
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
  heating: {
    key: 'heating',
    label: 'Riscaldamento',
    control: 'SegmentedControl',
    options: ['gas', 'autonomous', 'centralized', 'pellet', 'electric'],
    defaultValue: 'gas',
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
  hasElevator: {
    key: 'hasElevator',
    label: 'Con ascensore',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  hasPool: {
    key: 'hasPool',
    label: 'Con piscina',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },

  // Filtri specifici per COMMERCIAL
  hasDisabledAccess: {
    key: 'hasDisabledAccess',
    label: 'Accesso per disabili',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  hasSurveillance: {
    key: 'hasSurveillance',
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
  garageType: {
    key: 'garageType',
    label: 'Tipo di garage',
    control: 'SegmentedControl',
    options: ['Double Garage', 'Parking Space', 'Single Garage'],
    defaultValue: 'Parking Space',
    categorySpecific: true
  },
  hasElectricCharging: {
    key: 'hasElectricCharging',
    label: 'Colonnina di ricarica',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },

  // Filtri specifici per LAND
  landType: {
    key: 'landType',
    label: 'Tipo di terreno',
    control: 'SegmentedControl',
    options: ['Agricultural Land', 'Building Plot', 'Industrial Land'],
    defaultValue: 'Building Plot',
    categorySpecific: true
  },
  hasRoadAccess: {
    key: 'hasRoadAccess',
    label: 'Accesso stradale',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  slope: {
    key: 'slope',
    label: 'Inclinazione terreno',
    control: 'QuickNumericSelector',
    min: 0,
    max: 45,
    unit: '°',
    defaultValue: 0,
    categorySpecific: true
  }
};

export const CATEGORY_FILTERS: CategoryFilterMap = {
  RESIDENTIAL: [
    // Filtri specifici per residenziale (i filtri generali come price/size/contract sono mostrati separatamente)
    'heating',
    'minNumberOfRooms',
    'minNumberOfBathrooms',
    'floor',
    'hasElevator',
    'hasPool'
  ],
  COMMERCIAL: [
    // Commerciale supporta riscaldamento
    'heating',
    'hasDisabledAccess',
    'hasSurveillance',
    'constructionYear'
  ],
  GARAGE: [
    // Garage non ha riscaldamento applicabile qui
    'garageType',
    'hasElectricCharging'
  ],
  LAND: [
    // Land non mostra filtri di riscaldamento
    'landType',
    'hasRoadAccess',
    'slope'
  ]
};