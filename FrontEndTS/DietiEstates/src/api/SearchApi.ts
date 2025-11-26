import httpClient from '@/src/core/httpClient';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { SearchPayload } from '@/src/services/FilterPayloadBuilder';

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
};

export default SearchApi;