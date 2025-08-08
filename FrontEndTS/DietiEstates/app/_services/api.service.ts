import httpClient from './httpClient';
// Importa i tipi necessari per i dati
import { PropertyDetail, DashboardStats, PropertyDTO } from '@/components/Agent/PropertyDashboard/types'; // Importa tipi corretti
import { PropertyFilters } from '@/components/Buyer/SearchIntegration/types'; // Importa PropertyFilters

// --- Tipi Base ---
import { LoginCredentials } from '@/types/UserCredentials'; // Importa LoginCredentials
type ApiResponseToken = { token: string; userType: 'buyer' | 'agent' | 'admin' }; // Esempio
type ApiResponseSuccess = { success: boolean; message?: string; id?: string | number; token?: string }; // Esempio
type UserCreationData = { email: string; password?: string; name?: string; /* altri campi */ }; // Esempio generico
type PasswordChangeData = { oldPassword: string; newPassword: string };

// --- FLAG PER ABILITARE/DISABILITARE LE API MOCK ---
const USE_MOCK_API = false; // Imposta a 'true' per usare dati mock, 'false' per API reali

// Importa i dati mock da un file separato
import {
  mockDelay,
  MOCK_TOKEN_RESPONSE,
  MOCK_SUCCESS_RESPONSE,
  MOCK_AGENT_PROFILE,
  MOCK_AGENT_STATS,
  MOCK_PROPERTIES,
  MOCK_FEATURED_PROPERTIES,
} from './__mocks__/mockData';


// Definisce i path relativi degli endpoint API
export const apiEndpoints = {
  //! Auth
  //? Buyer
  buyerLogin: '/login',
  buyerRegister: '/signup', // Aggiunto endpoint registrazione

  //? Admin
  adminLogin: '/admins/login',

  //? Agent
  agentLogin: '/estates_agents/login',

  //! After login
  //? Admin
  adminChangePassword: '/admins/change-amministration-password',
  adminCreate: '/admins/create-admin',
  agentCreate: '/agent/create-estate-agent-account', // Corretto path come da file originale

  //? Agent
  agentProfile: '/agent/info', // Mantenuto endpoint profilo agente
  agentStats: '/agent/stats', // Endpoint per statistiche dashboard agente
  agentProperties: '/agent/properties', // Endpoint per lista immobili agente

  //? Properties (Buyer & General)
  searchProperties: '/api/properties/search', // Endpoint per ricerca immobili
  featuredProperties: '/api/properties/featured', // Endpoint per immobili in evidenza
  propertyDetails: '/properties/details', // Endpoint base per dettagli immobile (si userà /properties/{id})
  createProperty: '/properties/create', // Endpoint per creare un nuovo immobile (POST)

  address: '/address'

} as const;

// --- Funzioni API ---

// TODO: Continuare a definire tipi specifici per credentials, data e risposte API

export const PropertyDTO_to_PropertyDetail = async (property: PropertyDTO) : Promise<PropertyDetail> =>{
  var prop_detail : PropertyDetail = property;
  const address = (await httpClient.get(apiEndpoints.address + '/' + property.id_address)).data;
  prop_detail.address = property.propertyCategory + " in " + address.city + ", " + property.status; // TODO fix formatting
  prop_detail.agent = (await httpClient.get(apiEndpoints.agentProfile + '/' + property.id_agent)).data.fullName;
  console.log(prop_detail);
  return prop_detail;
}

/**
 * Esegue il login per un utente (acquirente).
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] loginUser:', credentials);
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'buyer' });
  }
  const response = await httpClient.post(apiEndpoints.buyerLogin, credentials);
  return response.data;
};

/**
 * Registra un nuovo utente (acquirente).
 * @param userData - Dati dell'utente da registrare.
 * @returns La risposta dell'API.
 */
export const registerUser = async (userData: UserCreationData): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] registerUser:', userData);
    return mockDelay(MOCK_SUCCESS_RESPONSE);
  }
  const response = await httpClient.post(apiEndpoints.buyerRegister, userData);
  return response.data;
};

/**
 * Esegue il login per un amministratore.
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginAdmin = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] loginAdmin:', credentials);
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'admin' });
  }
  const response = await httpClient.post(apiEndpoints.adminLogin, credentials);
  return response.data;
};

/**
 * Esegue il login per un agente immobiliare.
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginAgent = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] loginAgent:', credentials);
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'agent' });
  }
  const response = await httpClient.post(apiEndpoints.agentLogin, credentials);
  return response.data;
};

/**
 * Cambia la password di un amministratore.
 * @param passwordData - Dati per il cambio password.
 * @returns La risposta dell'API.
 */
export const changeAdminPassword = async (passwordData: PasswordChangeData): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] changeAdminPassword:', passwordData);
    return mockDelay(MOCK_SUCCESS_RESPONSE);
  }
  const response = await httpClient.post(apiEndpoints.adminChangePassword, passwordData);
  return response.data;
};

/**
 * Crea un nuovo account amministratore.
 * @param adminData - Dati del nuovo amministratore.
 * @returns La risposta dell'API.
 */
export const createAdmin = async (adminData: UserCreationData): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] createAdmin:', adminData);
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `admin-mock-${Date.now()}` });
  }
  const response = await httpClient.post(apiEndpoints.adminCreate, adminData);
  return response.data;
};

/**
 * Crea un nuovo account agente immobiliare.
 * @param agentData - Dati del nuovo agente.
 * @returns La risposta dell'API.
 */
export const createAgent = async (agentData: UserCreationData): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] createAgent:', agentData);
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `agent-mock-${Date.now()}` });
  }
  const response = await httpClient.post(apiEndpoints.agentCreate, agentData);
  return response.data;
};

/**
 * Recupera il profilo dell'agente loggato.
 * @returns La risposta dell'API con i dati del profilo.
 */
export const getAgentProfile = async () => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getAgentProfile');
    return mockDelay(MOCK_AGENT_PROFILE);
  }
  const response = await httpClient.get(apiEndpoints.agentProfile);
  return response.data;
};

/**
 * Recupera le statistiche per la dashboard dell'agente.
 * @returns La risposta dell'API con le statistiche.
 */
export const getAgentStats = async (/* params?: { startDate: string; endDate: string } */): Promise<DashboardStats> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getAgentStats');
    return mockDelay(MOCK_AGENT_STATS);
  }
  // TODO: Verificare se l'API reale supporta startDate/endDate ed eventualmente passarli
  const response = await httpClient.get(apiEndpoints.agentStats /*, { params } */);
  return response.data;
};


/**
 * Recupera la lista degli immobili associati all'agente loggato.
 * @param params - Eventuali parametri di query (es. paginazione, filtri).
 * @returns La risposta dell'API con la lista degli immobili.
 */
export const getAgentProperties = async (params?: any): Promise<PropertyDetail[]> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getAgentProperties:', params);
    // Simula paginazione semplice se presente nei mock
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return mockDelay(MOCK_PROPERTIES.slice(startIndex, endIndex));
  }
  const response = await httpClient.get(apiEndpoints.agentProperties, { params });
  // Assumiamo che l'API restituisca direttamente PropertyDetail[] o che l'adattamento avvenga nel componente
  return response.data;
};

/**
 * Esegue una ricerca di immobili basata sui parametri forniti.
 * @param searchParams - Oggetto con i parametri di ricerca (query, filtri, etc.).
 * @returns La risposta dell'API con i risultati della ricerca.
 */
export const searchProperties = async (
  params: { query?: string; filters?: PropertyFilters }
): Promise<PropertyDetail[]> => {
  if (USE_MOCK_API) {
    console.log(`[ApiService] searchProperties (MOCK) called with:`, {
      query: params.query,
      filters: JSON.stringify(params.filters, null, 2),
      mockDataCount: MOCK_PROPERTIES.length
    });
    const { query, filters } = params;
    let results = [...MOCK_PROPERTIES];
    console.log(`[ApiService] Initial MOCK_PROPERTIES:`, MOCK_PROPERTIES.map(p => ({id: p.id, address: p.address})));

    // 1. Filtro per query testuale
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p =>
        (p.address?.toLowerCase() || '').includes(lowerQuery) ||
        (p.description?.toLowerCase() || '').includes(lowerQuery)
      );
      console.log(`[ApiService] After text query filter ("${query}"): ${results.length} results`);
    }

    if (filters) {
      // 2. Filtri Generali
      const general = filters.general;
      if (general) {
        console.log('[ApiService] Applying general filters:', JSON.stringify(general));
        // Transaction Type
        if (general.transactionType) {
          results = results.filter(p => p.contractType === general.transactionType);
          console.log(`[ApiService] After transactionType ("${general.transactionType}"): ${results.length} results`);
        }
        // Price Range
        if (general.priceRange && general.priceRange.min !== undefined && general.priceRange.max !== undefined) {
          results = results.filter(p =>
            p.price >= general.priceRange!.min && p.price <= general.priceRange!.max
          );
          console.log(`[ApiService] After priceRange (${general.priceRange.min}-${general.priceRange.max}): ${results.length} results`);
        }
        // Size Range
        if (general.size && general.size.min !== undefined && general.size.max !== undefined) {
          results = results.filter(p =>
            p.area >= general.size!.min && p.area <= general.size!.max
          );
          console.log(`[ApiService] After sizeRange (${general.size.min}-${general.size.max}): ${results.length} results`);
        }
      }

      // 3. Filtri Specifici per Categoria
      console.log('[ApiService] Applying category specific filters. Current results count:', results.length);
      results = results.filter(p => {
        const propertyType = p.type as keyof Omit<PropertyFilters, 'general'>;
        const specificFiltersForType = filters[propertyType];
        
        console.log(`[ApiService] Checking property ID ${p.id} (type ${propertyType}) against filters:`, specificFiltersForType);
        
        if (!specificFiltersForType) {
          console.log(`[ApiService] Property ID ${p.id}: No specific filters for type ${propertyType}. Passing.`);
          return true;
        }
        // console.log(`[ApiService] Property ID ${p.id} (type ${propertyType}): Applying specific filters:`, JSON.stringify(specificFiltersForType));

        // Filtro per sottocategoria (es. 'Villa', 'Appartamento')
        if (specificFiltersForType.category) {
          if (!p.propertyDetails?.[propertyType]?.category || p.propertyDetails[propertyType]!.category !== specificFiltersForType.category) {
            // console.log(`[ApiService] Property ID ${p.id}: Failed subCategory. Expected ${specificFiltersForType.category}, got ${p.propertyDetails?.[propertyType]?.category}`);
            return false;
          }
        }
        
        // Filtri specifici per 'residential'
        if (propertyType === 'residential' && filters.residential && p.propertyDetails?.residential) {
          const resFilters = filters.residential;
          const propDetailsRes = p.propertyDetails.residential;
          if (resFilters.rooms && p.numberOfBedrooms !== parseInt(resFilters.rooms, 10)) { /*console.log(`[ApiService] Prop ID ${p.id} failed rooms`);*/ return false; }
          if (resFilters.bathrooms && p.numberOfBathrooms !== parseInt(resFilters.bathrooms, 10)) { /*console.log(`[ApiService] Prop ID ${p.id} failed bathrooms`);*/ return false; }
          if (resFilters.floor && propDetailsRes.floor !== resFilters.floor) { /*console.log(`[ApiService] Prop ID ${p.id} failed floor`);*/ return false; }
          if (resFilters.elevator !== undefined && propDetailsRes.elevator !== resFilters.elevator) { /*console.log(`[ApiService] Prop ID ${p.id} failed elevator`);*/ return false; }
          if (resFilters.pool !== undefined && propDetailsRes.pool !== resFilters.pool) { /*console.log(`[ApiService] Prop ID ${p.id} failed pool`);*/ return false; }
        }
        // Filtri specifici per 'commercial'
        else if (propertyType === 'commercial' && filters.commercial && p.propertyDetails?.commercial) {
          const comFilters = filters.commercial;
          const propDetailsCom = p.propertyDetails.commercial;
          if (comFilters.bathrooms && propDetailsCom.bathrooms !== comFilters.bathrooms) { /*console.log(`[ApiService] Prop ID ${p.id} failed com_bathrooms`);*/ return false; }
          if (comFilters.emergencyExit !== undefined && propDetailsCom.emergencyExit !== comFilters.emergencyExit) { /*console.log(`[ApiService] Prop ID ${p.id} failed emergencyExit`);*/ return false; }
          if (comFilters.constructionDate && propDetailsCom.constructionDate !== comFilters.constructionDate) { /*console.log(`[ApiService] Prop ID ${p.id} failed constructionDate`);*/ return false; }
        }
        // Filtri specifici per 'industrial'
        else if (propertyType === 'industrial' && filters.industrial && p.propertyDetails?.industrial) {
          const indFilters = filters.industrial;
          const propDetailsInd = p.propertyDetails.industrial;
          if (indFilters.ceilingHeight && propDetailsInd.ceilingHeight !== indFilters.ceilingHeight) { /*console.log(`[ApiService] Prop ID ${p.id} failed ceilingHeight`);*/ return false; }
          if (indFilters.fireSystem !== undefined && propDetailsInd.fireSystem !== indFilters.fireSystem) { /*console.log(`[ApiService] Prop ID ${p.id} failed fireSystem`);*/ return false; }
          if (indFilters.floorLoad && propDetailsInd.floorLoad !== indFilters.floorLoad) { /*console.log(`[ApiService] Prop ID ${p.id} failed floorLoad`);*/ return false; }
          if (indFilters.offices && propDetailsInd.offices !== indFilters.offices) { /*console.log(`[ApiService] Prop ID ${p.id} failed offices`);*/ return false; }
          if (indFilters.structure && propDetailsInd.structure !== indFilters.structure) { /*console.log(`[ApiService] Prop ID ${p.id} failed structure`);*/ return false; }
        }
        // Filtri specifici per 'land'
        else if (propertyType === 'land' && filters.land && p.propertyDetails?.land) {
          const landFilters = filters.land;
          const propDetailsLand = p.propertyDetails.land;
          if (landFilters.soilType && propDetailsLand.soilType !== landFilters.soilType) { /*console.log(`[ApiService] Prop ID ${p.id} failed soilType`);*/ return false; }
          if (landFilters.slope && propDetailsLand.slope !== landFilters.slope) { /*console.log(`[ApiService] Prop ID ${p.id} failed slope`);*/ return false; }
        }
        // console.log(`[ApiService] Property ID ${p.id} (type ${propertyType}): Passed all specific filters for its type.`);
        return true; // Passa tutti i filtri specifici applicabili
      });
      console.log(`[ApiService] After category specific filters: ${results.length} results`);
    }
    console.log(`[ApiService] searchProperties (MOCK) final results (${results.length}):`, results.map(r => ({id: r.id, address: r.address })));
    return mockDelay(results);
  }

  // Logica API Reale (da implementare o adattare)
  // Qui dovresti mappare params.query e params.filters ai parametri attesi dal tuo backend
  const backendParams: any = {};
  if (params.query) backendParams.q = params.query;
  if (params.filters) {
    // Esempio di "flattening" o trasformazione dei filtri se il backend non accetta l'oggetto complesso
    // Questo dipenderà fortemente da come è strutturata la tua API backend
    Object.assign(backendParams, params.filters.general); // Copia i filtri generali
    // Potresti dover gestire le categorie specifiche in modo diverso
    // es. backendParams.residential_rooms = params.filters.residential.rooms;
    // Per ora, passiamo l'intero oggetto filters se il backend lo supporta,
    // altrimenti dovrai implementare una mappatura dettagliata.
    // backendParams.filters = JSON.stringify(params.filters); // Se il backend si aspetta una stringa JSON
  }

  // const response = await httpClient.get(apiEndpoints.searchProperties, { params: backendParams });
  // return response.data;
  console.warn("searchProperties: La logica API reale non è completamente implementata per i filtri complessi.");
  // Fallback a una chiamata semplice per ora se non si usa il mock
  const response = await httpClient.get(apiEndpoints.searchProperties+params.query, { params: { query: params.query } }); // TODO rimuovere parametri (params), utili solo per MOCK
  return response.data;
};

/**
 * Recupera gli immobili marcati come "in evidenza".
 * @returns La risposta dell'API con gli immobili in evidenza.
 */
export const getFeaturedProperties = async (): Promise<PropertyDetail[]> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getFeaturedProperties');
    return mockDelay(MOCK_FEATURED_PROPERTIES);
  }
  const response = await httpClient.get(apiEndpoints.featuredProperties);
  const DTOs: PropertyDTO[] = response.data;
  console.log(response);
  console.log(DTOs);
  console.log("HERE");
  console.log(DTOs[0].id)
  const ret = await Promise.all(DTOs.map((value: PropertyDTO) => PropertyDTO_to_PropertyDetail(value)));
  return ret;
};


/**
 * Recupera i dettagli di un immobile specifico.
 * @param propertyId - L'ID dell'immobile.
 * @returns La risposta dell'API con i dettagli dell'immobile.
 */
export const getPropertyDetails = async (propertyId: string | number): Promise<PropertyDetail> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getPropertyDetails:', propertyId);
    // Converte propertyId a numero per confronto con id mock
    const numericId = typeof propertyId === 'string' ? parseInt(propertyId, 10) : propertyId;
    const foundProperty = MOCK_PROPERTIES.find(p => p.id === numericId);
    if (foundProperty) {
      return mockDelay({ ...foundProperty });
    } else {
      return Promise.reject(new Error('Immobile mock non trovato'));
    }
  }
  // Costruisce l'URL completo per l'endpoint specifico dell'immobile
  const url = `${apiEndpoints.propertyDetails}/${propertyId}`;
  const response = await httpClient.get(url);
  return response.data;
};

/**
 * Crea un nuovo immobile.
 * @param propertyData - Dati dell'immobile da creare (la struttura esatta dipenderà dal backend).
 * @returns La risposta dell'API (es. successo e ID del nuovo immobile).
 */
export const createProperty = async (propertyData: any): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] createProperty:', propertyData);
    // Simula successo e restituisce un ID fittizio
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `prop-mock-${Date.now()}` });
  }
  // La chiamata reale userà POST sull'endpoint base delle proprietà
  const response = await httpClient.post(apiEndpoints.createProperty, propertyData);
  return response.data;
};

/**
 * Esegue il logout dell'utente invalidando il token sul server.
 * @returns La risposta dell'API.
 */
export const logout = async (): Promise<ApiResponseSuccess> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] logout: Token invalidato');
    return mockDelay(MOCK_SUCCESS_RESPONSE);
  }
  try {
    // TODO: L'endpoint /api/auth/logout non è ancora disponibile.
    // Una volta disponibile, decommentare la riga seguente:
    // const response = await httpClient.post(apiEndpoints.logout);
    // return response.data;
    console.warn("logout: L'endpoint /api/auth/logout non è ancora disponibile. Simulazione successo.");
    return { success: true, message: "Logout simulato con successo." };
  } catch (error) {
    console.error('Errore durante il logout API:', error);
    throw error; // Rilancia l'errore per essere gestito a monte
  }
};

// Esporta un oggetto contenente tutte le funzioni per un accesso facilitato
const ApiService = {
  endpoints: apiEndpoints,
  loginUser,
  registerUser,
  loginAdmin,
  loginAgent,
  changeAdminPassword,
  createAdmin,
  createAgent,
  getAgentProfile,
  getAgentStats,
  getAgentProperties,
  searchProperties,
  getFeaturedProperties,
  getPropertyDetails,
  createProperty, // Aggiunta la nuova funzione
  logout, // Aggiunta la nuova funzione di logout
  // Aggiungere qui altre funzioni API man mano che vengono implementate (es. favorites, visits)
};

export default ApiService;
