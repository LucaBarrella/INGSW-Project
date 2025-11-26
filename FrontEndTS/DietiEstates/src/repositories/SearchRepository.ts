import SearchApi from '@/src/api/SearchApi';
import { SearchPayload } from '@/src/services/FilterPayloadBuilder';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';

/**
 * SearchRepository
 * - Responsabilità: chiamate API relative alla ricerca di proprietà.
 * - Mantiene un'interfaccia minimale per la chiamata a SearchApi.
 */

const SearchRepository = {
  async searchProperties(payload: SearchPayload): Promise<{ content: PropertyDetail[]; totalElements?: number }> {
    return SearchApi.searchProperties(payload);
  },
};

export default SearchRepository;