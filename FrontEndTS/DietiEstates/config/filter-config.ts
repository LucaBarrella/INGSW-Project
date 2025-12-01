import { useTranslation } from 'react-i18next';
import { FilterDefinition, CategoryFilterMap } from '@/components/Buyer/SearchIntegration/types';

// Configurazione statica per i valori di default e la struttura logica
// Questa viene utilizzata dal Context e per la logica che non richiede traduzioni UI
export const FILTERS_CONFIG: { [key: string]: Omit<FilterDefinition, 'label' | 'unit'> & { label?: string, unit?: string } } = {
  // Filtri generali
  contract: {
    key: 'contract',
    control: 'SegmentedControl',
    // Allineato al DTO backend (valori in maiuscolo)
    options: ['RENT', 'SALE'],
    defaultValue: null
  },
  priceRange: {
    key: 'priceRange',
    control: 'RangeSlider',
    min: 0,
    max: 2000000,
    step: 50000,
    defaultValue: { min: 0, max: 500000 }
  },
  size: {
    key: 'size',
    control: 'RangeSlider',
    min: 20,
    max: 1000,
    step: 10,
    unit: 'm²', // Fallback statico
    defaultValue: { min: 20, max: 200 }
  },
  // Raggio di ricerca (single-value slider) - mostrato sempre nei filtri generali
  searchRadiusKm: {
    key: 'searchRadiusKm',
    control: 'RangeSlider',
    min: 1,
    max: 50,
    step: 1,
    unit: 'km', // Fallback statico
    defaultValue: { min: 1, max: 20 }
  },
  // Riscaldamento: non è più un filtro generale perché non applica a tutte le tipologie (es. LAND)
  // Normalizziamo le opzioni per allinearle al DTO backend (Capitalized)
  heating: {
    key: 'heating',
    control: 'SegmentedControl',
    options: ['Centralized', 'Autonomous', 'Absent'],
    defaultValue: 'Absent',
    categorySpecific: true
  },

  // Filtri specifici per RESIDENTIAL
  minNumberOfRooms: {
    key: 'minNumberOfRooms',
    control: 'QuickNumericSelector',
    min: 1,
    max: 10,
    defaultValue: 1,
    categorySpecific: true
  },
  minNumberOfBathrooms: {
    key: 'minNumberOfBathrooms',
    control: 'QuickNumericSelector',
    min: 1,
    max: 6,
    defaultValue: 1,
    categorySpecific: true
  },
  floor: {
    key: 'floor',
    control: 'QuickNumericSelector',
    min: 0,
    max: 50,
    defaultValue: 0,
    categorySpecific: true
  },
  minNumberOfFloors: {
    key: 'minNumberOfFloors',
    control: 'QuickNumericSelector',
    min: 1,
    max: 10,
    defaultValue: 1,
    categorySpecific: true
  },
  mustHaveElevator: {
    key: 'mustHaveElevator',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  
  // Allineamento con API /properties/search
  // Anno minimo di costruzione (minYearBuilt)
  minYearBuilt: {
    key: 'minYearBuilt',
    control: 'QuickNumericSelector',
    min: 1800,
    max: new Date().getFullYear(),
    defaultValue: 1900,
  },

  // Numero minimo di posti auto (minParkingSpaces)
  minParkingSpaces: {
    key: 'minParkingSpaces',
    control: 'QuickNumericSelector',
    min: 0,
    max: 20,
    defaultValue: 0,
    categorySpecific: true
  },

  // Stato/condizione accettata (acceptedCondition) - allineato con API (array di status possibili)
  acceptedCondition: {
    key: 'acceptedCondition',
    control: 'SegmentedControl',
    options: ['NEW', 'GOOD_CONDITION', 'RENOVATED', 'TO_BE_RENOVATED', 'POOR_CONDITION', 'UNDER_CONSTRUCTION'],
    // Il backend si aspetta una lista; usiamo array per coerenza con FilterRequest DTO
    defaultValue: ['GOOD_CONDITION'],
  },

  // Energia minima richiesta (minEnergyRating)
  minEnergyRating: {
    key: 'minEnergyRating',
    control: 'SegmentedControl',
    // Allineato con API: includere A4 e A3 e NOT_APPLIABLE
    options: ['A4','A3','A2','A1','B','C','D','E','F','G','NOT_APPLIABLE'],
    defaultValue: 'C',
  },

  // Giardino accettato (acceptedGarden) -- mappa ai valori API
  acceptedGarden: {
    key: 'acceptedGarden',
    control: 'SegmentedControl',
    options: ['PRIVATE','SHARED','ABSENT'],
    // Backend accetta una lista; il controllo UI è single-select -> default come stringa per compatibilità
    defaultValue: 'ABSENT',
    categorySpecific: true
  },

  // Arredato (mustBeFurnished / isFurnished)
  mustBeFurnished: {
    key: 'mustBeFurnished',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },

  // Filtri specifici per COMMERCIAL
  mustHaveWheelchairAccess: {
    key: 'mustHaveWheelchairAccess',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  mustHaveSurveillance: {
    key: 'mustHaveSurveillance',
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
  constructionYear: {
    key: 'constructionYear',
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
    control: 'Switch',
    defaultValue: false,
    categorySpecific: true
  },
};

// Hook per ottenere la configurazione dei filtri con le traduzioni applicate
export const useFilterConfig = () => {
  const { t } = useTranslation();

  const filters: { [key: string]: FilterDefinition } = Object.keys(FILTERS_CONFIG).reduce((acc, key) => {
    const config = FILTERS_CONFIG[key];
    const translatedConfig: any = { ...config };

    // Traduzione Label
    translatedConfig.label = t(`filters.${key}.label`);

    // Traduzione Unit (se presente)
    if (config.unit) {
      // Mappa unità specifiche a chiavi i18n
      const unitKeyMap: Record<string, string> = {
        'm²': 'squareMeters',
        'km': 'kilometers'
      };
      const unitKey = unitKeyMap[config.unit] || config.unit;
      translatedConfig.unit = t(`units.${unitKey}`);
    }

    // Traduzione Options (se presenti e di tipo SegmentedControl o QuickNumericSelector)
    if (config.options && (config.control === 'SegmentedControl' || config.control === 'QuickNumericSelector')) {
      translatedConfig.options = config.options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value;
        return {
          value: value,
          label: t(`filters.${key}.options.${value}`)
        };
      });
    }

    acc[key] = translatedConfig;
    return acc;
  }, {} as { [key: string]: FilterDefinition });

  return filters;
};

// Manteniamo ALL_FILTERS per retrocompatibilità (ma deprecato) o per usi statici che non richiedono traduzione
// Nota: Questo non avrà le traduzioni corrette, ma solo undefined o fallback se usati
export const ALL_FILTERS = FILTERS_CONFIG;

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