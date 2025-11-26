export interface Range {
  min: number;
  max: number;
  _enabled?: boolean;
}

/**
 * Valori di default per price ranges (usati in più punti)
 */
export const DEFAULT_PRICE_RANGES = {
  sale: {
    min: 0,
    max: 1000000,
    defaultRange: { min: 0, max: 250000 },
  },
  rent: {
    min: 0,
    max: 10000,
    defaultRange: { min: 0, max: 2500 },
  },
};

export interface Geolocation {
  lat: number;
  lon: number;
  label?: string;
  radiusKm?: number;
}

export const RESIDENTIAL_CATEGORIES = [
  "Casa Indipendente",
  "Appartamento",
  "Villa",
  "Loft",
  "Attico"
] as const;

export const COMMERCIAL_CATEGORIES = [
  "Negozio",
  "Ufficio",
  "Ristorazione",
  "Locale_Commerciale"
] as const;

export const GARAGE_CATEGORIES = [
  "Double Garage",
  "Parking Space",
  "Single Garage"
] as const;

export const LAND_CATEGORIES = [
  "Pascolo",
  "Edificabile",
  "Coltivabile"
] as const;

type ResidentialCategory = typeof RESIDENTIAL_CATEGORIES[number];
type CommercialCategory = typeof COMMERCIAL_CATEGORIES[number];
type LandCategory = typeof LAND_CATEGORIES[number];
type GarageCategory = typeof GARAGE_CATEGORIES[number];

/**
 * Wrapper che rappresenta lo stato di un singolo filtro nell'UI.
 * - value: valore corrente
 * - defaultValue: valore di default (usato per reset / confronto)
 * - isModified: true se l'utente ha modificato il filtro rispetto al default
 */
export interface FilterState<T> {
  value: T;
  defaultValue: T;
  isModified: boolean;
}

/**
 * SearchCriteria: rappresenta lo stato dei filtri come esposto dai componenti UI
 * Usa FilterState<T> per permettere al builder di decidere cosa includere nel payload.
 *
 * I valori di default seguono le richieste:
 * - centerLatitude: 41.902782
 * - centerLongitude: 12.496366
 * - radiusInMeters: 5000
 */
export interface SearchCriteria {
  general: {
    contract: FilterState<"rent" | "sale">;
    priceRange: FilterState<Range>;
    size: FilterState<Range>;
    searchRadiusKm: FilterState<Range>;
    centerLatitude: FilterState<number>;
    centerLongitude: FilterState<number>;
    radiusInMeters: FilterState<number>;
    enabled: FilterState<boolean>;
  };
  residential: {
    category: FilterState<ResidentialCategory>;
    minNumberOfFloors: FilterState<number | undefined>;
    minNumberOfRooms: FilterState<number | string>;
    minNumberOfBathrooms: FilterState<number | string>;
    floor: FilterState<string>;
    mustHaveElevator: FilterState<boolean>;
    hasPool: FilterState<boolean>;
    minParkingSpaces: FilterState<number | undefined>;
    enabled: FilterState<boolean>;
  };
  commercial: {
    category: FilterState<CommercialCategory>;
    minNumberOfFloors: FilterState<number | undefined>;
    minNumberOfRooms: FilterState<number | undefined>;
    minNumberOfBathrooms: FilterState<number | undefined>;
    mustHaveWheelchairAccess: FilterState<boolean>;
    constructionYear: FilterState<string | number>;
    enabled: FilterState<boolean>;
  };
  garage: {
    category: FilterState<GarageCategory>;
    minNumberOfFloors: FilterState<number | undefined>;
    mustHaveSurveillance: FilterState<boolean>;
    enabled: FilterState<boolean>;
  };
  land: {
    category: FilterState<LandCategory>;
    mustBeAccessibleFromStreet: FilterState<boolean>;
    slope: FilterState<string | number>;
    enabled: FilterState<boolean>;
  };
}

/**
 * Valori di default globali per la geolocalizzazione (evitare magic numbers sparsi)
 */
export const DEFAULT_CENTER_LATITUDE = 41.902782;
export const DEFAULT_CENTER_LONGITUDE = 12.496366;
export const DEFAULT_RADIUS_IN_METERS = 20000;

/**
 * Oggetto di default completo per inizializzare i filtri nell'UI / nello stato.
 * Utilizzare questo oggetto quando si crea lo stato iniziale dei filtri.
 * I default per i Range seguono le impostazioni presenti in config/filter-config.ts ove applicabile.
 */
export const defaultSearchCriteria: SearchCriteria = {
  general: {
    contract: { value: 'sale', defaultValue: 'sale', isModified: false },
    priceRange: { value: { min: 0, max: 500000 }, defaultValue: { min: 0, max: 500000 }, isModified: false },
    size: { value: { min: 20, max: 200 }, defaultValue: { min: 20, max: 200 }, isModified: false },
    searchRadiusKm: { value: { min: 1, max: 20 }, defaultValue: { min: 1, max: 20 }, isModified: false },
    centerLatitude: { value: DEFAULT_CENTER_LATITUDE, defaultValue: DEFAULT_CENTER_LATITUDE, isModified: false },
    centerLongitude: { value: DEFAULT_CENTER_LONGITUDE, defaultValue: DEFAULT_CENTER_LONGITUDE, isModified: false },
    radiusInMeters: { value: DEFAULT_RADIUS_IN_METERS, defaultValue: DEFAULT_RADIUS_IN_METERS, isModified: false },
    enabled: { value: true, defaultValue: true, isModified: false },
  },
  residential: {
    category: { value: RESIDENTIAL_CATEGORIES[0], defaultValue: RESIDENTIAL_CATEGORIES[0], isModified: false },
    minNumberOfFloors: { value: undefined, defaultValue: undefined, isModified: false },
    minNumberOfRooms: { value: 1, defaultValue: 1, isModified: false },
    minNumberOfBathrooms: { value: 1, defaultValue: 1, isModified: false },
    floor: { value: '0', defaultValue: '0', isModified: false },
    mustHaveElevator: { value: false, defaultValue: false, isModified: false },
    hasPool: { value: false, defaultValue: false, isModified: false },
    minParkingSpaces: { value: 0, defaultValue: 0, isModified: false },
    enabled: { value: false, defaultValue: false, isModified: false },
  },
  commercial: {
    category: { value: COMMERCIAL_CATEGORIES[0], defaultValue: COMMERCIAL_CATEGORIES[0], isModified: false },
    minNumberOfFloors: { value: undefined, defaultValue: undefined, isModified: false },
    minNumberOfRooms: { value: undefined, defaultValue: undefined, isModified: false },
    minNumberOfBathrooms: { value: undefined, defaultValue: undefined, isModified: false },
    mustHaveWheelchairAccess: { value: false, defaultValue: false, isModified: false },
    constructionYear: { value: new Date().getFullYear(), defaultValue: new Date().getFullYear(), isModified: false },
    enabled: { value: false, defaultValue: false, isModified: false },
  },
  garage: {
    category: { value: GARAGE_CATEGORIES[0], defaultValue: GARAGE_CATEGORIES[0], isModified: false },
    minNumberOfFloors: { value: undefined, defaultValue: undefined, isModified: false },
    mustHaveSurveillance: { value: false, defaultValue: false, isModified: false },
    enabled: { value: false, defaultValue: false, isModified: false },
  },
  land: {
    category: { value: LAND_CATEGORIES[0], defaultValue: LAND_CATEGORIES[0], isModified: false },
    mustBeAccessibleFromStreet: { value: false, defaultValue: false, isModified: false },
    slope: { value: 0, defaultValue: 0, isModified: false },
    enabled: { value: false, defaultValue: false, isModified: false },
  },
};

/**
 * PropertyFilters interface removed.
 * Usare SearchCriteria (con FilterState<T>) come unica fonte di verità per lo stato dei filtri.
 *
 * Nota: se è necessario supportare dati persistiti nel vecchio formato, la migrazione deve
 * essere eseguita nel repository (es. SearchRepository.loadFilters) o in un adattatore dedicato.
 * Questo evita duplicazione di tipi nel DTO e mantiene SearchDTO come fonte unica.
 */

/**
 * Alias di compatibilità:
 * Manteniamo `PropertyFilters` come alias verso `SearchCriteria` per evitare di
 * dover riscrivere immediatamente tutti i riferimenti nel codebase legacy.
 * Il tipo primario resta `SearchCriteria`.
 */
export type PropertyFilters = SearchCriteria;