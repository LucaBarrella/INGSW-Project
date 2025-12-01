import { FilterRequest } from '@/src/dto/request/FilterRequest.dto';
import { PagedPropertyResponse } from '@/src/dto/response/PropertyResponse.dto';
import { PropertyDetailDTO } from '@/src/dto/PropertyDetailsDTO';
import SearchApi from '@/src/api/SearchApi';

class SearchRepository {
  private searchApi: typeof SearchApi;

  constructor(searchApi: typeof SearchApi) {
    this.searchApi = searchApi;
  }

  async searchProperties(
    filter: FilterRequest,
    pageable?: { page?: number; size?: number; sort?: string[] },
  ): Promise<PagedPropertyResponse> {
    return this.searchApi.searchProperties(filter, pageable);
  }

  async getPropertiesByIds(propertyIds: string[]): Promise<PropertyDetailDTO[]> {
    return this.searchApi.getPropertiesByIds(propertyIds);
  }
}

export default SearchRepository;