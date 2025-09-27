import httpClient from '../../../app/_services/httpClient';
import { PropertyDetail, DashboardStats, PropertyDTO } from '../../../components/Agent/PropertyDashboard/types';
import { PropertyFilters, Geolocation } from '../../../components/Buyer/SearchIntegration/types';
import { mockDelay, MOCK_AGENT_STATS, MOCK_PROPERTIES, MOCK_FEATURED_PROPERTIES } from '../../../app/_services/__mocks__/mockData';

// Definisce i path relativi degli endpoint API per la gestione delle proprietà
const propertyEndpoints = {
  agentStats: '/agent/stats',
  agentProperties: '/agent/properties',
  searchProperties: '/properties/search',
  featuredProperties: '/properties/featured',
  propertyDetails: '/properties/details',
  createProperty: '/properties/create',
  address: '/address',
} as const;

/**
 * Converte un PropertyDTO in PropertyDetail (funzione di utilità)
 * @param property - Il PropertyDTO da convertire.
 * @returns Promise<PropertyDetail>
 */
export const PropertyDTO_to_PropertyDetail = async (property: PropertyDTO): Promise<PropertyDetail> => {
  const prop_detail: PropertyDetail = property;
  console.log(property);
  console.log("//////////////////////////////////////////");
  prop_detail.agentFullName = property.agent.firstName + " " + property.agent.lastName;
  return prop_detail;
};

/**
 * Recupera le statistiche per la dashboard dell'agente.
 * @returns La risposta dell'API con le statistiche.
 */
export const getAgentStats = async (): Promise<DashboardStats> => {
  console.log('[PropertyApiService] getAgentStats');
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay(MOCK_AGENT_STATS);
  }
  const response = await httpClient.get(propertyEndpoints.agentStats);
  return response.data;
};

/**
 * Recupera la lista degli immobili associati all'agente loggato.
 * @param params - Eventuali parametri di query (es. paginazione, filtri).
 * @returns La risposta dell'API con la lista degli immobili.
 */
export const getAgentProperties = async (params?: any): Promise<PropertyDetail[]> => {
  console.log('[PropertyApiService] getAgentProperties:', params);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return mockDelay(MOCK_PROPERTIES.slice(startIndex, endIndex));
  }
  const response = await httpClient.get(propertyEndpoints.agentProperties, { params });
  return response.data;
};

/**
 * Esegue una ricerca di immobili basata sui parametri forniti.
 * @param searchParams - Oggetto con i parametri di ricerca (query, filtri, etc.).
 * @returns La risposta dell'API con i risultati della ricerca.
 */
export const searchProperties = async (
  params: { query?: string; filters?: PropertyFilters; geolocation?: Geolocation; selectedMainCategory?: keyof Omit<PropertyFilters, 'general'> | null }
): Promise<PropertyDetail[]> => {
  console.log(`[PropertyApiService] searchProperties called with:`, {
    query: params.query,
    filters: JSON.stringify(params.filters, null, 2),
    mockDataCount: MOCK_PROPERTIES.length
  });

  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    alert("LUCA SMETTILA DI USARE LA MOCK API");
    const { query, filters } = params;
    let results = [...MOCK_PROPERTIES];

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p =>
        (p.address.city?.toLowerCase() || '').includes(lowerQuery) ||
        (p.description?.toLowerCase() || '').includes(lowerQuery)
      );
    }

    if (filters) {
      const general = filters.general;
      if (general) {
        if (general.contract) {
          results = results.filter(p => p.contractType === general.contract);
        }
        if (general.priceRange) {
          if (general.priceRange.min !== undefined ) {
            results = results.filter(p =>
              p.price >= general.priceRange!.min
            );
          }

          if (general.priceRange.max !== undefined) {
            results = results.filter(p =>
              p.price >= general.priceRange!.max
            );
          }
        }
        if (general.size && general.size.min !== undefined && general.size.max !== undefined) {
          results = results.filter(p =>
            p.area >= general.size!.min && p.area <= general.size!.max
          );
        }
      }
      
      results = results.filter(p => {
        const propertyType = p.type as keyof Omit<PropertyFilters, 'general'>;
        const specificFiltersForType = filters[propertyType];
        
        if (!specificFiltersForType) {
          return true;
        }

        if (specificFiltersForType.category) {
          const propCategory = p.propertyDetails?.[propertyType]?.category;
          if (!propCategory || propCategory !== specificFiltersForType.category) {
            return false;
          }
        }
        
        if (propertyType === 'residential' && filters.residential && p.propertyDetails?.residential) {
          const resFilters = filters.residential;
          const propDetailsRes = p.propertyDetails.residential;
          if (resFilters.rooms && p.numberOfBedrooms !== parseInt(resFilters.rooms, 10)) return false;
          if (resFilters.bathrooms && p.numberOfBathrooms !== parseInt(resFilters.bathrooms, 10)) return false;
          if (resFilters.floor && propDetailsRes.floor !== resFilters.floor) return false;
          if (resFilters.elevator !== undefined && propDetailsRes.elevator !== resFilters.elevator) return false;
          if (resFilters.pool !== undefined && propDetailsRes.pool !== resFilters.pool) return false;
        } else if (propertyType === 'commercial' && filters.commercial && p.propertyDetails?.commercial) {
          const comFilters = filters.commercial;
          const propDetailsCom = p.propertyDetails.commercial;
          if (comFilters.bathrooms && propDetailsCom.bathrooms !== comFilters.bathrooms) return false;
          if (comFilters.emergencyExit !== undefined && propDetailsCom.emergencyExit !== comFilters.emergencyExit) return false;
          if (comFilters.constructionDate && propDetailsCom.constructionDate !== comFilters.constructionDate) return false;
        } else if (propertyType === 'industrial' && filters.industrial && p.propertyDetails?.industrial) {
          const indFilters = filters.industrial;
          const propDetailsInd = p.propertyDetails.industrial;
          if (indFilters.ceilingHeight && propDetailsInd.ceilingHeight !== indFilters.ceilingHeight) return false;
          if (indFilters.fireSystem !== undefined && propDetailsInd.fireSystem !== indFilters.fireSystem) return false;
          if (indFilters.floorLoad && propDetailsInd.floorLoad !== indFilters.floorLoad) return false;
          if (indFilters.offices && propDetailsInd.offices !== indFilters.offices) return false;
          if (indFilters.structure && propDetailsInd.structure !== indFilters.structure) return false;
        } else if (propertyType === 'land' && filters.land && p.propertyDetails?.land) {
          const landFilters = filters.land;
          const propDetailsLand = p.propertyDetails.land;
          if (landFilters.soilType && propDetailsLand.soilType !== landFilters.soilType) return false;
          if (landFilters.slope && propDetailsLand.slope !== landFilters.slope) return false;
        }
        return true;
      });
    }
    return mockDelay(results);
  }

  // Costruisce il payload secondo la struttura DTO del backend
  const searchPayload: any = {};
  
  // Aggiunge la query al payload se presente
  if (params.query) {
    searchPayload.query = params.query;
  }
  
  // Aggiunge i filtri generali
  if (params.filters?.general) {
    const general = params.filters.general;
    
    // Mappa i campi obbligatori per la ricerca geografica
    if (params.geolocation) {
      searchPayload.centerLatitude = params.geolocation.lat;
      searchPayload.centerLongitude = params.geolocation.lon;
      
      if (general.searchRadiusKm) {
        // Converti km in metri (1km = 1000m)
        searchPayload.radiusInMeters = general.searchRadiusKm.max * 1000;
      } else {
        // Default radius se non specificato
        searchPayload.radiusInMeters = 20000; // 20km default
      }
    }
    
    // Mappa i campi comuni a tutte le proprietà
    if (general.contract) {
      searchPayload.contract = general.contract.toUpperCase(); // SALE/RENT in maiuscolo
    }
    
    if (general.priceRange) {
      if (general.priceRange.min !== undefined) {
        searchPayload.minPrice = general.priceRange.min;
      }
      if (general.priceRange.max !== undefined) {
        searchPayload.maxPrice = general.priceRange.max;
      }
    }
    
    if (general.size) {
      if (general.size.min !== undefined) {
        searchPayload.minArea = general.size.min;
      }
      if (general.size.max !== undefined) {
        searchPayload.maxArea = general.size.max;
      }
    }
  }
  
  // Aggiunge filtri specifici per categoria
  if (params.filters && params.selectedMainCategory) {
    const category = params.selectedMainCategory;
    const categoryFilters = params.filters[category];
    
    if (categoryFilters) {
      // Filtri comuni a Commercial, Residential, Garage
      // Gestione type-safe per i filtri specifici di categoria
      if (category === 'residential') {
        const resFilters = categoryFilters as PropertyFilters['residential'];
        if (resFilters.minNumberOfFloors !== undefined) {
          searchPayload.minNumberOfFloors = resFilters.minNumberOfFloors;
        }
        if (resFilters.minNumberOfRooms !== undefined) {
          searchPayload.minNumberOfRooms = resFilters.minNumberOfRooms;
        }
        if (resFilters.minNumberOfBathrooms !== undefined) {
          searchPayload.minNumberOfBathrooms = resFilters.minNumberOfBathrooms;
        }
        if (resFilters.minParkingSpaces !== undefined) {
          searchPayload.minParkingSpaces = resFilters.minParkingSpaces;
        }
        if (resFilters.mustHaveElevator !== undefined) {
          searchPayload.mustHaveElevator = resFilters.mustHaveElevator;
        }
      }
      else if (category === 'commercial') {
        const comFilters = categoryFilters as PropertyFilters['commercial'];
        if (comFilters.minNumberOfFloors !== undefined) {
          searchPayload.minNumberOfFloors = comFilters.minNumberOfFloors;
        }
        if (comFilters.minNumberOfRooms !== undefined) {
          searchPayload.minNumberOfRooms = comFilters.minNumberOfRooms;
        }
        if (comFilters.minNumberOfBathrooms !== undefined) {
          searchPayload.minNumberOfBathrooms = comFilters.minNumberOfBathrooms;
        }
        if (comFilters.mustHaveWheelchairAccess !== undefined) {
          searchPayload.mustHaveWheelchairAccess = comFilters.mustHaveWheelchairAccess;
        }
      }
      else if (category === 'garage') {
        const garageFilters = categoryFilters as PropertyFilters['garage'];
        if (garageFilters.minNumberOfFloors !== undefined) {
          searchPayload.minNumberOfFloors = garageFilters.minNumberOfFloors;
        }
        if (garageFilters.mustHaveSurveillance !== undefined) {
          searchPayload.mustHaveSurveillance = garageFilters.mustHaveSurveillance;
        }
      }
      else if (category === 'land') {
        const landFilters = categoryFilters as PropertyFilters['land'];
        if (landFilters.mustBeAccessibleFromStreet !== undefined) {
          searchPayload.mustBeAccessibleFromStreet = landFilters.mustBeAccessibleFromStreet;
        }
      }
    }
  }
  
  console.log("[DEBUG] Search payload:", JSON.stringify(searchPayload, null, 2));
  console.log("[DEBUG] Calling POST:", propertyEndpoints.searchProperties);
  
  const response = await httpClient.post(propertyEndpoints.searchProperties, searchPayload);
  console.log("[DEBUG] API Response:", JSON.stringify(response.data, null, 2));
  
  // La risposta API ha struttura paginata: { content: PropertyDTO[], ... }
  const DTOs: PropertyDTO[] = response.data.content || [];
  const ret = await Promise.all(DTOs.map((value: PropertyDTO) => PropertyDTO_to_PropertyDetail(value)));
  return ret;
};

/**
 * Recupera gli immobili marcati come "in evidenza".
 * @returns La risposta dell'API con gli immobili in evidenza.
 */
export const getFeaturedProperties = async (): Promise<PropertyDetail[]> => {
  console.log('[PropertyApiService] getFeaturedProperties');
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay(MOCK_FEATURED_PROPERTIES);
  }
  const response = await httpClient.get(propertyEndpoints.featuredProperties);
  const DTOs: PropertyDTO[] = response.data;
  const ret = await Promise.all(DTOs.map((value: PropertyDTO) => PropertyDTO_to_PropertyDetail(value)));
  return ret;
};

/**
 * Recupera i dettagli di un immobile specifico.
 * @param propertyId - L'ID dell'immobile.
 * @returns La risposta dell'API con i dettagli dell'immobile.
 */
export const getPropertyDetails = async (propertyId: string | number): Promise<PropertyDetail> => {
  console.log('[PropertyApiService] getPropertyDetails:', propertyId);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    const numericId = typeof propertyId === 'string' ? parseInt(propertyId, 10) : propertyId;
    const foundProperty = MOCK_PROPERTIES.find(p => p.id === numericId);
    if (foundProperty) {
      return mockDelay({ ...foundProperty });
    } else {
      return Promise.reject(new Error('Immobile mock non trovato'));
    }
  }
  const url = `${propertyEndpoints.propertyDetails}/${propertyId}`;
  const response = await httpClient.get(url);
  return PropertyDTO_to_PropertyDetail(response.data);
};

/**
 * Crea un nuovo immobile.
 * @param propertyData - Dati dell'immobile da creare.
 * @returns La risposta dell'API (es. successo e ID del nuovo immobile).
 */
export const createProperty = async (propertyData: any): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[PropertyApiService] createProperty:', propertyData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, id: `prop-mock-${Date.now()}` });
  }
  const response = await httpClient.post(propertyEndpoints.createProperty, propertyData);
  return response.data;
};

export default {
  PropertyDTO_to_PropertyDetail,
  getAgentStats,
  getAgentProperties,
  searchProperties,
  getFeaturedProperties,
  getPropertyDetails,
  createProperty,
};