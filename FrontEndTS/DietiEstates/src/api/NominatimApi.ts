import axios from 'axios';
import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import { IGeocodingService } from './interfaces/IGeocodingService';
import i18n from '../utils/i18n';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

/**
 * NominatimApi implements IGeocodingService using OpenStreetMap Nominatim API.
 */
export default class NominatimApi implements IGeocodingService {
  /**
   * Retrieves autocomplete suggestions from Nominatim.
   * 
   * @param query - The search string.
   * @param limit - Maximum number of results.
   * @param signal - AbortSignal to cancel the request.
   * @returns A promise resolving to an array of PhotonFeature.
   */
  async getSuggestions(query: string, limit: number, signal?: AbortSignal): Promise<PhotonFeature[]> {
    if (!query || !query.trim()) return [];

    const lang = (i18n.language || 'en').split('-')[0];
    const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(query)}&limit=${limit}&format=jsonv2&addressdetails=1&accept-language=${lang}`;

    try {
      const response = await axios.get(url, { signal, timeout: 5000 });
      const data = response.data;

      if (!Array.isArray(data)) return [];

      return data.map((item: any) => this.mapToPhotonFeature(item));
    } catch (error) {
      if (axios.isCancel(error)) return [];
      console.error('[NominatimApi] Error fetching suggestions:', error);
      throw error;
    }
  }

  private mapToPhotonFeature(item: any): PhotonFeature {
    const address = item.address || {};
    return {
      id: `nominatim_${item.place_id}`,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
      },
      properties: {
        name: address.amenity || address.road || item.display_name.split(',')[0],
        street: address.road,
        housenumber: address.house_number,
        city: address.city || address.town || address.village,
        state: address.state,
        country: address.country,
        osm_id: item.osm_id,
        osm_type: item.osm_type,
      },
      label: item.display_name,
    };
  }
}