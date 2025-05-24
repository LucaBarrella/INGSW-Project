// Property Types
export interface Range {
  min: number;
  max: number;
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

export const INDUSTRIAL_CATEGORIES = [
  "Magazzino",
  "Capannone",
  "Fabbrica"
] as const;

export const LAND_CATEGORIES = [
  "Pascolo",
  "Edificabile",
  "Coltivabile"
] as const;

type ResidentialCategory = typeof RESIDENTIAL_CATEGORIES[number];
type CommercialCategory = typeof COMMERCIAL_CATEGORIES[number];
type IndustrialCategory = typeof INDUSTRIAL_CATEGORIES[number];
type LandCategory = typeof LAND_CATEGORIES[number];

// Define the main filters interface
export interface PropertyFilters {
  general: {
    transactionType: "rent" | "sale";
    priceRange: Range;
    size: Range;
  };
  residential: {
    category: ResidentialCategory;
    rooms: string;
    bathrooms: string;
    floor: string;
    elevator: boolean;
    pool: boolean;
  };
  commercial: {
    category: CommercialCategory;
    bathrooms: string;
    emergencyExit: boolean;
    constructionDate: string;
  };
  industrial: {
    category: IndustrialCategory;
    ceilingHeight: string;
    fireSystem: boolean;
    floorLoad: string;
    offices: string;
    structure: string;
  };
  land: {
    category: LandCategory;
    soilType: string;
    slope: string;
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
    max: 10000000,
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
