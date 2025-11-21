export interface Range {
  min: number;
  max: number;
}

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

export interface PropertyFilters {
  general: {
    contract: "rent" | "sale";
    priceRange: Range;
    size: Range;
    searchRadiusKm?: Range;
  };
  residential: {
    category: ResidentialCategory;
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
    constructionYear: string | number;
  };
  garage: {
    category: GarageCategory;
    minNumberOfFloors?: number;
    mustHaveSurveillance: boolean;
  };
  land: {
    category: LandCategory;
    mustBeAccessibleFromStreet: boolean;
    slope: string | number;
  };
}