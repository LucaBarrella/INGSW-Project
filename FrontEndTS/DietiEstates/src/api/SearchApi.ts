import httpClient from '@/src/core/httpClient';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { SearchPayload } from '@/src/services/FilterPayloadBuilder';
import { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';

type SearchResponse = {
  content: PropertyDetail[]; // allineato alla risposta effettiva
  totalElements?: number; // allineato alla risposta effettiva
};

const SearchApi = {
  async searchProperties(payload: SearchPayload): Promise<SearchResponse> {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Invalid parameter: payload must be an object');
    }

    try {
      console.log('[SearchApi] Payload finale inviato:', JSON.stringify(payload, null, 2));
      const response = await httpClient.post('/properties/search', payload);
      return response.data as SearchResponse;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Recupera i dettagli delle proprietà a partire dagli id forniti.
   * POST /api/properties/history
   * @param propertyIds array di id (max 100)
   */
  async getPropertiesByIds(propertyIds: string[]): Promise<PropertyDetailDTO[]> {
    if (!Array.isArray(propertyIds)) {
      throw new Error('Invalid parameter: propertyIds must be an array');
    }
    if (propertyIds.length > 100) {
      throw new Error('Invalid parameter: propertyIds length must be <= 100');
    }

    try {
      const response = await httpClient.post('/api/properties/history', { propertyIds });
      return response.data as PropertyDetailDTO[];
    } catch (err) {
      throw err;
    }
  },
};

export default SearchApi;