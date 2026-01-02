import { PropertyCategory, Contract, PropertyCondition, EnergyRating } from '../request/FilterRequest.dto';

export interface AddressResponseDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AgentResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface PropertyResponse {
  id: number;
  description: string;
  price: number;
  area: number;
  yearBuilt: number;
  contract: Contract;
  propertyCategory: PropertyCategory;
  condition: PropertyCondition;
  energyRating: EnergyRating;
  address: AddressResponseDTO;
  agent: AgentResponseDTO;
  createdAt: string; // LocalDateTime in backend, string in TS
  updatedAt: string; // LocalDateTime in backend, string in TS
  firstImageUrl: string;
  numberOfImages: number;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
}

export interface PagedPropertyResponse {
  content: PropertyResponse[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}