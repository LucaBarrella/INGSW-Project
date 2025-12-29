import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';

/**
 * IGeocodingService defines the contract for geocoding and autocomplete services.
 */
export interface IGeocodingService {
  /**
   * Retrieves autocomplete suggestions for a given query.
   * 
   * @param query - The search string.
   * @param limit - Maximum number of results.
   * @param signal - AbortSignal to cancel the request.
   * @returns A promise resolving to an array of PhotonFeature.
   */
  getSuggestions(query: string, limit: number, signal?: AbortSignal): Promise<PhotonFeature[]>;
}