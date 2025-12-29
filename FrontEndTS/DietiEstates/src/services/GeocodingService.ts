import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import { IGeocodingService } from '../api/interfaces/IGeocodingService';
import PhotonApi from '../api/PhotonApi';
import NominatimApi from '../api/NominatimApi';

/**
 * GeocodingService provides a unified interface for geocoding with fallback logic.
 */
export default class GeocodingService implements IGeocodingService {
  private readonly photonApi: IGeocodingService;
  private readonly nominatimApi: IGeocodingService;
  private photonCooldownUntil: number = 0;
  private readonly COOLDOWN_DURATION_MS = 120000; // 2 minuti di cooldown

  constructor() {
    this.photonApi = new PhotonApi();
    this.nominatimApi = new NominatimApi();
  }

  /**
   * Retrieves suggestions using Photon with fallback to Nominatim.
   * Implements a circuit breaker logic to avoid Photon if it's failing.
   *
   * @param query - The search string.
   * @param limit - Maximum number of results.
   * @param signal - AbortSignal to cancel the request.
   * @returns A promise resolving to an array of PhotonFeature.
   */
  async getSuggestions(query: string, limit: number, signal?: AbortSignal): Promise<PhotonFeature[]> {
    if (this.isPhotonInCooldown()) {
      console.log('[GeocodingService] Photon is in cooldown, using Nominatim directly.');
      return await this.nominatimApi.getSuggestions(query, limit, signal);
    }

    try {
      return await this.photonApi.getSuggestions(query, limit, signal);
    } catch (error) {
      this.activatePhotonCooldown();
      console.warn('[GeocodingService] Photon API failed, falling back to Nominatim and activating cooldown:', error);
      return await this.nominatimApi.getSuggestions(query, limit, signal);
    }
  }

  private isPhotonInCooldown(): boolean {
    return Date.now() < this.photonCooldownUntil;
  }

  private activatePhotonCooldown(): void {
    this.photonCooldownUntil = Date.now() + this.COOLDOWN_DURATION_MS;
  }
}