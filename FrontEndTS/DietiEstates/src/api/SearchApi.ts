import httpClient from '@/src/core/httpClient';
import { FilterRequest } from '@/src/dto/request/FilterRequest.dto';
import { PagedPropertyResponse } from '@/src/dto/response/PropertyResponse.dto';
import ApiError from '@/src/core/errors/ApiError';
import { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';
import { PlaceDTO } from '@/src/dto/response/PlaceDTO';
import axios from 'axios';

class SearchApi {
  private placesCache = new Map<string, { data: PlaceDTO[], timestamp: number }>();
  private CACHE_TTL = 1000 * 60 * 5; // 5 minuti
  /**
   * Esegue la chiamata POST /properties/search.
   * Il body della richiesta è la combinazione di FilterRequest e dei parametri di paginazione (page/size/sort).
   * @param filter: FilterRequest - l'oggetto FilterRequest completo.
   * @param pageable: { page?: number; size?: number; sort?: string[] } - un oggetto opzionale per i parametri di paginazione.
   * @returns Promise<PagedPropertyResponse> - la risposta paginata delle proprietà.
   */
  async searchProperties(
    filter: FilterRequest,
    pageable?: { page?: number; size?: number; sort?: string[] },
  ): Promise<PagedPropertyResponse> {
    if (typeof filter !== 'object' || filter === null) {
      console.error('[SearchApi] Errore: Il parametro filter deve essere un oggetto.');
      throw new ApiError(400, 'Richiesta non valida: il filtro deve essere un oggetto.');
    }

    try {
      const payload = {
        ...filter,
        ...(pageable ? pageable : {}),
      };
      console.log('[SearchApi] Payload finale inviato:', JSON.stringify(payload, null, 2));

      const response = await httpClient.post('/properties/search', payload);
      console.log('[SearchApi] Risposta ricevuta:', JSON.stringify(response.data, null, 2));
      return response.data as PagedPropertyResponse;
    } catch (error: any) {
      console.error('[SearchApi] Errore durante la ricerca delle proprietà:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      // Gestione di errori non ApiError (es. errori di rete generici)
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || 'Errore sconosciuto durante la ricerca delle proprietà.',
      );
    }
  }

  /**
   * Recupera i dettagli delle proprietà a partire dagli id forniti.
   * POST /api/properties/history
   * @param propertyIds array di id (max 100)
   */
  async getPropertiesByIds(propertyIds: string[]): Promise<PropertyDetailDTO[]> {
    if (!Array.isArray(propertyIds)) {
      throw new ApiError(400, 'Richiesta non valida: propertyIds deve essere un array');
    }
    if (propertyIds.length > 100) {
      throw new ApiError(400, 'Richiesta non valida: propertyIds length deve essere <= 100');
    }

    try {
      const response = await httpClient.post('/api/properties/history', { propertyIds });
      return response.data as PropertyDetailDTO[];
    } catch (error: any) {
      console.error('[SearchApi] Errore durante il recupero delle proprietà per ID:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || 'Errore sconosciuto durante il recupero delle proprietà per ID.',
      );
    }
  }

  /**
   * Recupera i servizi nelle vicinanze per una proprietà.
   * GET /api/properties/{id}/places
   */
  async getNearbyServices(propertyId: string | number, signal?: AbortSignal, retries = 1): Promise<PlaceDTO[]> {
    const cacheKey = propertyId.toString();
    const cached = this.placesCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL)) {
      console.log(`[SearchApi] Returning cached places for property ${propertyId}`);
      return cached.data;
    }

    const startTime = Date.now();
    try {
      console.log(`[SearchApi] Fetching nearby services for property ${propertyId}...`);
      const response = await httpClient.get<PlaceDTO[]>(`/api/properties/${propertyId}/places`, { signal });
      const duration = Date.now() - startTime;
      console.log(`[SearchApi] Nearby services fetched in ${duration}ms`);
      
      this.placesCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      return response.data;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      if (axios.isCancel(error)) {
        console.log(`[SearchApi] Request for property ${propertyId} places was canceled.`);
        throw error;
      }

      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.status === 408;
      
      if (retries > 0 && isTimeout) {
        console.warn(`[SearchApi] Timeout fetching places for ${propertyId}. Retrying... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getNearbyServices(propertyId, signal, retries - 1);
      }

      console.error(`[SearchApi] Error fetching nearby services after ${duration}ms:`, error);
      throw error;
    }
  }
}

export default new SearchApi();