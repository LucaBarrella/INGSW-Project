import httpClient from '../../../app/_services/httpClient';
import { PropertyDetailDTO, DashboardStats, PropertyDTO } from '../dto/PropertyDetailsDTO';
import { PropertyFilters, Geolocation } from '../dto/SearchDTO';
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
 * Recupera le statistiche per la dashboard dell'agente.
 * @returns La risposta dell'API con le statistiche.
 */
export const getAgentStats = async (): Promise<DashboardStats> => {
  console.log('[PropertyApiService] getAgentStats');
  const response = await httpClient.get(propertyEndpoints.agentStats);
  return response.data;
};

/**
 * Recupera la lista degli immobili associati all'agente loggato.
 * @param params - Eventuali parametri di query (es. paginazione, filtri).
 * @returns La risposta dell'API con la lista degli immobili.
 */
export const getAgentProperties = async (params?: any): Promise<PropertyDTO[]> => {
  console.log('[PropertyApiService] getAgentProperties:', params);
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
): Promise<PropertyDTO[]> => {
  console.log(`[PropertyApiService] searchProperties called with:`, {
    query: params.query,
    filters: JSON.stringify(params.filters, null, 2)
  });

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
  return DTOs;
};

/**
 * Recupera gli immobili marcati come "in evidenza".
 * @returns La risposta dell'API con gli immobili in evidenza.
 */
export const getFeaturedProperties = async (): Promise<PropertyDTO[]> => {
  console.log('[PropertyApiService] getFeaturedProperties');
  const response = await httpClient.get(propertyEndpoints.featuredProperties);
  return response.data;
};

/**
 * Recupera i dettagli di un immobile specifico.
 * @param propertyId - L'ID dell'immobile.
 * @returns La risposta dell'API con i dettagli dell'immobile.
 */
export const getPropertyDetails = async (propertyId: string | number): Promise<PropertyDTO> => {
  console.log('[PropertyApiService] getPropertyDetails:', propertyId);
  const url = `${propertyEndpoints.propertyDetails}/${propertyId}`;
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Crea un nuovo immobile.
 * @param propertyData - Dati dell'immobile da creare.
 * @returns La risposta dell'API (es. successo e ID del nuovo immobile).
 */
export const createProperty = async (propertyData: Partial<PropertyDTO>): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[PropertyApiService] createProperty:', propertyData);
  const response = await httpClient.post(propertyEndpoints.createProperty, propertyData);
  return response.data;
};

export default {
  getAgentStats,
  getAgentProperties,
  searchProperties,
  getFeaturedProperties,
  getPropertyDetails,
  createProperty,
};