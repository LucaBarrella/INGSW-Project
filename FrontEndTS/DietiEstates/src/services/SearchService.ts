import { FilterRequest } from "../dto/request/FilterRequest.dto";
import { PagedPropertyResponse } from "../dto/response/PropertyResponse.dto";
import SearchRepository from "../repositories/SearchRepository";
import SearchApi from "../api/SearchApi";
import { FilterPayloadBuilder } from "./FilterPayloadBuilder";
 
class SearchService {
  private filterPayloadBuilder: FilterPayloadBuilder;
  private searchRepository: SearchRepository;
 
  constructor(
    filterPayloadBuilder: FilterPayloadBuilder,
    searchRepository: SearchRepository
  ) {
    this.filterPayloadBuilder = filterPayloadBuilder;
    this.searchRepository = searchRepository;
  }
 
  async searchProperties(
    filters: any, // This will be the UI state (SearchState)
    page: number,
    size: number
  ): Promise<PagedPropertyResponse> {
    console.log("SearchService: Received filters", filters);
 
    // Fix: geolocation was sometimes lost because the UI stores it at state.geolocation
    // while older code expected filters.geolocation. Build a resilient geolocation object
    // preferring explicit state.geolocation, then falling back to values present in
    // filters.filters.general.* (SearchCriteria shape).
    const geolocationFromState = filters?.geolocation;
    const generalFilters = filters?.filters?.general;

    // Fallback costruito a partire dai filtri generali (forma FilterState o primitiva)
    const geolocationFallback = generalFilters
      ? {
          centerLatitude: generalFilters.centerLatitude?.value ?? generalFilters.centerLatitude,
          centerLongitude: generalFilters.centerLongitude?.value ?? generalFilters.centerLongitude,
          // manteniamo sia radiusInMeters che searchRadiusKm come possibili sorgenti
          radiusInMeters: generalFilters.radiusInMeters?.value ?? generalFilters.radiusInMeters,
          searchRadiusKm: generalFilters.searchRadiusKm?.value ?? generalFilters.searchRadiusKm,
        }
      : undefined;

    // Start dal geolocation esplicita nello state se presente, altrimenti fallback dai filtri.
    // IMPORTANTE: permettiamo ai filtri generali di sovrascrivere il solo raggio anche se esiste una geolocation esplicita.
    let geolocation: any = geolocationFromState ?? geolocationFallback ?? undefined;

    if (generalFilters) {
      // priorità: searchRadiusKm (può essere numero o range {min,max}) -> converti a metri
      const rawSearchRadius = generalFilters.searchRadiusKm?.value ?? generalFilters.searchRadiusKm;
      let overrideKm: number | undefined;
      if (rawSearchRadius !== undefined && rawSearchRadius !== null) {
        if (typeof rawSearchRadius === 'object') {
          overrideKm = Number(rawSearchRadius.max ?? rawSearchRadius.value?.max ?? rawSearchRadius.value ?? rawSearchRadius.min ?? rawSearchRadius.value?.min);
        } else {
          overrideKm = Number(rawSearchRadius);
        }
        if (!Number.isFinite(overrideKm)) overrideKm = undefined;
      }

      // se è presente un override del raggio usalo (in metri)
      if (overrideKm !== undefined) {
        geolocation = { ...(geolocation ?? {}), radiusKm: overrideKm, radiusInMeters: overrideKm * 1000 };
      } else if (generalFilters.radiusInMeters?.value !== undefined) {
        geolocation = { ...(geolocation ?? {}), radiusInMeters: Number(generalFilters.radiusInMeters.value) };
      }

      // permetti anche override espliciti di centro
      if (generalFilters.centerLatitude?.value !== undefined) {
        geolocation = { ...(geolocation ?? {}), centerLatitude: generalFilters.centerLatitude.value };
      }
      if (generalFilters.centerLongitude?.value !== undefined) {
        geolocation = { ...(geolocation ?? {}), centerLongitude: generalFilters.centerLongitude.value };
      }
    }
 
    const filterRequest: FilterRequest = this.filterPayloadBuilder.build(filters, geolocation);
 
    console.log("SearchService: Built FilterRequest", filterRequest);

    if (
      filterRequest.centerLatitude == null ||
      filterRequest.centerLongitude == null ||
      filterRequest.radiusInMeters == null
    ) {
      throw new Error(
        "Invalid or missing geolocation fields"
      );
    }

    try {
      const properties = await this.searchRepository.searchProperties(
        filterRequest,
        { page, size }
      );
      return properties;
    } catch (error) {
      console.error("SearchService: Error during property search", error);
      // Re-throw the error to be handled by the upper layer (e.g., the hook)
      throw error;
    }
  }

  async getPropertiesByIds(propertyIds: string[]): Promise<any[]> {
    return this.searchRepository.getPropertiesByIds(propertyIds);
  }
}

export async function getPropertiesByIds(propertyIds: string[]) {
  const repo = new SearchRepository(SearchApi);
  return repo.getPropertiesByIds(propertyIds);
}
 
// Backward-compatible attachment: allow both
// - import { getPropertiesByIds } from '.../SearchService' (preferred)
// - SearchService.getPropertiesByIds(...) or (less common) getPropertiesByIds(serviceInstance, ids)
;(SearchService as any).getPropertiesByIds = function (...args: any[]) {
  // If called with a single array argument: treat as propertyIds
  if (args.length === 1 && Array.isArray(args[0])) {
    return getPropertiesByIds(args[0]);
  }
  // If called with (serviceInstance, ids)
  if (args.length >= 2 && args[0] && typeof args[0].getPropertiesByIds === "function") {
    return args[0].getPropertiesByIds(args[1]);
  }
  // Fallback: try to resolve first argument as ids
  return getPropertiesByIds(args[0] || []);
};
 
export default SearchService;
