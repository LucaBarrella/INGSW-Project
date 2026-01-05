import { PhotonFeature } from '@/components/Buyer/SearchIntegration/types';
import axios from 'axios';
import { IGeocodingService } from './interfaces/IGeocodingService';

const PHOTON_BASE = 'https://photon.komoot.io/api/';

/**
 * PhotonApi implements IGeocodingService using Komoot Photon API.
 */
export default class PhotonApi implements IGeocodingService {
  /**
   * Retrieves autocomplete suggestions from Photon.
   *
   * @param query - The search string.
   * @param limit - Maximum number of results.
   * @param signal - AbortSignal to cancel the request.
   * @returns A promise resolving to an array of PhotonFeature.
   */
  async getSuggestions(query: string, limit: number, signal?: AbortSignal): Promise<PhotonFeature[]> {
    if (!query || !query.trim()) return [];

    const q = query.trim();
    const lang = 'en';
    const url = `${PHOTON_BASE}?q=${encodeURIComponent(q)}&limit=${limit}&lang=${lang}`;

    // Un singolo retry per Photon per gestire glitch temporanei prima di attivare il fallback
    return this.fetchWithRetry(url, q, limit, 1, signal);
  }

  private async fetchWithRetry(
    url: string,
    q: string,
    limit: number,
    retries: number,
    signal?: AbortSignal
  ): Promise<PhotonFeature[]> {
    const startTime = Date.now();
    try {
      console.log(`[PhotonApi] Fetching suggestions for: "${q}" (url: ${url}), retries left: ${retries}`);
      const res = await axios.get(url, { signal, timeout: 5000 });
      const duration = Date.now() - startTime;
      console.log(`[PhotonApi] Request successful in ${duration}ms`);

      const data = (res && (res as any).data) || null;
      if (!data || !Array.isArray(data.features)) return [];

      const features: PhotonFeature[] = (data.features as any[]).map((f: any) => {
        const p = f.properties || {};
        const parts: string[] = [];
        if (p.name) parts.push(p.name);
        if (p.street) parts.push(p.street);
        if (p.housenumber) parts.push(p.housenumber);
        if (p.city) parts.push(p.city);
        if (p.state) parts.push(p.state);
        if (p.country) parts.push(p.country);
        const label = parts.length ? parts.join(', ') : p.label || p.osm_value || p.name || '';

        return {
          id: f.id ?? `${p.osm_type}_${p.osm_id}`,
          type: f.type ?? 'Feature',
          geometry: f.geometry,
          properties: p,
          label,
        } as PhotonFeature;
      });

      return features;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError' || error.message === 'canceled') {
        console.log(`[PhotonApi] Request for "${q}" was canceled.`);
        return [];
      }

      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      
      if (retries > 0 && (isTimeout || !error.response)) {
        console.warn(`[PhotonApi] Retrying for "${q}"... (${retries} attempts left)`);
        // Piccolo delay prima del retry se è un timeout
        if (isTimeout) await new Promise(resolve => setTimeout(resolve, 500));
        return this.fetchWithRetry(url, q, limit, retries - 1, signal);
      }

      console.warn(`[PhotonApi] error fetching suggestions after ${duration}ms (handled by fallback):`, {
        message: error.message,
        code: error.code,
        status: error.status,
        isTimeout
      });
      throw error;
    }
  }
}