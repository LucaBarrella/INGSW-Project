import httpClient from '@/src/core/httpClient';
import { FilterRequest } from '@/src/dto/request/FilterRequest.dto';
import { PagedPropertyResponse, PropertyResponse } from '@/src/dto/response/PropertyResponse.dto';
import ApiError from '@/src/core/errors/ApiError';
import { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';

class SearchApi {
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
}

export default new SearchApi();