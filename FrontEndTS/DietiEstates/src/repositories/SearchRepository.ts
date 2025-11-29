import SearchApi from '@/src/api/SearchApi';
import { SearchPayload } from '@/src/services/FilterPayloadBuilder';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';

/**
 * SearchRepository
 * - Responsabilità: chiamate API relative alla ricerca di proprietà.
 * - Mantiene un'interfaccia minimale per la chiamata a SearchApi.
 */

const SearchRepository = {
  async searchProperties(payload: SearchPayload): Promise<{ content: PropertyDetail[]; totalElements?: number }> {
    return SearchApi.searchProperties(payload);
  },

  /**
   * Recupera i dettagli delle proprietà a partire dagli id forniti.
   * Fa da wrapper al metodo API SearchApi.getPropertiesByIds.
   */
  async getPropertiesByIds(propertyIds: string[]): Promise<PropertyDetailDTO[]> {
    if (!Array.isArray(propertyIds)) {
      throw new Error('Invalid parameter: propertyIds must be an array');
    }
    return SearchApi.getPropertiesByIds(propertyIds);
  },
};

export default SearchRepository;