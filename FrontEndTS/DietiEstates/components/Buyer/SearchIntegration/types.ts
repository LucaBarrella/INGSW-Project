// Property Types
export interface Range {
  min: number;
  max: number;
}

// Photon / Geolocation types (used for Photon autocomplete integration)
export interface PhotonFeature {
  id: string;
  type: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    state?: string;
    country?: string;
    osm_id?: number | string;
    [key: string]: any;
  };
  label?: string; // Convenience label derived from properties
}

export interface Geolocation {
  lat: number;
  lon: number;
  label?: string;
  radiusKm?: number; // default search radius in kilometers
}

// Category Constants
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

// Define the main filters interface (aligned with backend field names)
export interface PropertyFilters {
  general: {
    contract: "rent" | "sale";
    priceRange: Range;
    size: Range;
    // Raggio di ricerca in chilometri (usiamo Range per compatibilità con RangeSlider)
    searchRadiusKm?: Range;
  };
  residential: {
    category: ResidentialCategory;
    // Backend-aligned fields
    minNumberOfFloors?: number;
    minNumberOfRooms: number | string;
    minNumberOfBathrooms: number | string;
    floor: string;
    mustHaveElevator: boolean;
    hasPool: boolean;
    minParkingSpaces?: number;
  };
  commercial: {
    category: CommercialCategory;
    minNumberOfFloors?: number;
    minNumberOfRooms?: number;
    minNumberOfBathrooms?: number;
    mustHaveWheelchairAccess: boolean;
    minNumeroVetrine?: number;
    constructionYear: string | number;
  };
  garage: {
    category: GarageCategory;
    // Garage specific backend field
    minNumberOfFloors?: number;
    mustHaveSurveillance: boolean;
  };
  land: {
    category: LandCategory;
    // Backend naming
    mustBeAccessibleFromStreet: boolean;
    slope: string | number;
  };
}

// Categories Type
export interface Category {
  name: string;
}

export interface Categories {
  [key: string]: Category;
}

// Component Props
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  onSearchPress?: () => void;
  placeholder?: string;
  activeFiltersCount?: number;
}

export interface RangeSliderProps {
  title: string;
  type?: "price" | "size";
  value: Range;
  onChange: (value: Range) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  unit?: string;
}

export interface QuickNumericSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  maxValue?: number;
  minValue?: number;
  unit?: string;
}

export interface CategorySpecificFiltersProps {
  category: keyof Omit<PropertyFilters, "general">; // Più specifico
  filters: PropertyFilters; // L'intero oggetto filters per riferimento e lettura
  onUpdateFilters: (
    update: {
      category: keyof Omit<PropertyFilters, "general">;
      newFilters: Partial<PropertyFilters[keyof Omit<PropertyFilters, "general">]>;
    }
  ) => void; // Payload specifico per l'aggiornamento di una categoria
  onBackToCategories?: () => void;
}

export type PriceRanges = {
  rent: {
    min: number;
    max: number;
    step: number;
    defaultRange: Range;
  };
  sale: {
    min: number;
    max: number;
    step: number;
    defaultRange: Range;
  };
};

export const DEFAULT_PRICE_RANGES: PriceRanges = {
  rent: {
    min: 0,
    max: 10000,
    step: 100,
    defaultRange: { min: 0, max: 2000 }
  },
  sale: {
    min: 0,
    max: 2000000,
    step: 50000,
    defaultRange: { min: 0, max: 500000 }
  }
};

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  categories: Categories;
  selectedMainCategory: keyof Omit<PropertyFilters, "general"> | null;
  onSelectMainCategory: (category: keyof Omit<PropertyFilters, "general"> | null) => void;
  onUpdateFilters: (
    updatedPart: Partial<PropertyFilters> |
                 { category: keyof Omit<PropertyFilters, 'general'>; newFilters: Partial<PropertyFilters[keyof Omit<PropertyFilters, 'general'>]> } |
                 { subCategory: 'general'; newFilters: Partial<PropertyFilters['general']> }
  ) => void;
  onResetFilters: (keepTransactionType?: boolean) => void; // Aggiunto keepTransactionType opzionale
  onApplyAndNavigate?: () => void; // New prop for applying filters and navigating
}

export interface SearchAndFilterProps {
  // onSearch and onFiltersChange are no longer needed as SearchAndFilter uses the context
  placeholder?: string;
  categories: Categories; // Still needed for FilterPanel setup if not from context
  onSearchSubmitNavigate?: () => void; // New prop for navigation
}

// Nuove interfacce per la ristrutturazione dei filtri
export type FilterControlType =
  | 'RangeSlider'
  | 'SegmentedControl'
  | 'Switch'
  | 'QuickNumericSelector'
  | 'LabelInput';

export interface FilterDefinition {
  key: string;
  label: string;
  control: FilterControlType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: any;
  categorySpecific?: boolean;
}

export interface CategoryFilterMap {
  [category: string]: string[];
}

export interface FilterValues {
  [key: string]: any;
}
