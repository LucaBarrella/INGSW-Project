export type PropertyCategory = "RESIDENTIAL" | "COMMERCIAL" | "GARAGE" | "LAND";
export type PropertyCondition = "NEW" | "GOOD_CONDITION" | "RENOVATED" | "TO_BE_RENOVATED" | "POOR_CONDITION" | "UNDER_CONSTRUCTION";
export type EnergyRating = "A4" | "A3" | "A2" | "A1" | "B" | "C" | "D" | "E" | "F" | "G" | "NOT_APPLIABLE";
export type Garden = "PRIVATE" | "SHARED" | "ABSENT";
export type Heating = "Centralized" | "Autonomous" | "Absent";
export type Contract = "RENT" | "SALE";

export interface FilterRequest {
  category?: PropertyCategory;
  propertySubcategoryName?: string;
  contract?: Contract;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  minYearBuilt?: number;
  acceptedCondition?: PropertyCondition[];
  minEnergyRating?: EnergyRating;
  centerLatitude: number;
  centerLongitude: number;
  radiusInMeters: number;
  minNumberOfFloors?: number;
  minNumberOfRooms?: number;
  minNumberOfBathrooms?: number;
  minParkingSpaces?: number;
  heating?: Heating;
  acceptedGarden?: Garden[];
  mustBeFurnished?: boolean;
  mustHaveElevator?: boolean;
  mustHaveWheelchairAccess?: boolean;
  mustHaveSurveillance?: boolean;
  mustBeAccessibleFromStreet?: boolean;
}