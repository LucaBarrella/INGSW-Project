import httpClient from './httpClient';
// Importa i tipi necessari per i dati
import { PropertyDetail, DashboardStats } from '@/components/Agent/PropertyDashboard/types'; // Importa tipi corretti

// --- Tipi Base ---
// TODO: Espandere e dettagliare questi tipi man mano che le API vengono definite meglio
type LoginCredentials = { email: string; password: string };
type ApiResponseToken = { token: string; userType: 'buyer' | 'agent' | 'admin' }; // Esempio
type ApiResponseSuccess = { success: boolean; message?: string; id?: string | number }; // Esempio
type UserCreationData = { email: string; password?: string; name?: string; /* altri campi */ }; // Esempio generico
type PasswordChangeData = { oldPassword: string; newPassword: string };

// --- FLAG PER ABILITARE/DISABILITARE LE API MOCK ---
const USE_MOCK_API = true; // Imposta a 'true' per usare dati mock, 'false' per API reali

// Importa i dati mock da un file separato
import {
  mockDelay,
  MOCK_TOKEN_RESPONSE,
  MOCK_SUCCESS_RESPONSE,
  MOCK_AGENT_PROFILE,
  MOCK_AGENT_STATS,
  MOCK_PROPERTIES,
  MOCK_FEATURED_PROPERTIES,
  MOCK_PROPERTY_DETAILS
} from './__mocks__/mockData';

// Definisce i path relativi degli endpoint API
export const apiEndpoints = {
  //! Auth
  //? Buyer
  buyerLogin: '/users/login',
  buyerRegister: '/users/register', // Aggiunto endpoint registrazione

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
  agentProfile: '/agent/profile', // Mantenuto endpoint profilo agente
  agentStats: '/agent/stats', // Endpoint per statistiche dashboard agente
  agentProperties: '/agent/properties', // Endpoint per lista immobili agente

  //? Properties (Buyer & General)
  searchProperties: '/properties/search', // Endpoint per ricerca immobili
  featuredProperties: '/properties/featured', // Endpoint per immobili in evidenza
  propertyDetails: '/properties/details', // Endpoint base per dettagli immobile (si userà /properties/{id})
  createProperty: '/properties/create', // Endpoint per creare un nuovo immobile (POST)

} as const;

// --- Funzioni API ---

// TODO: Continuare a definire tipi specifici per credentials, data e risposte API

/**
 * Esegue il login per un utente (acquirente).
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] loginUser:', credentials);
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'buyer' }) as any; // Cast a any
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
    return mockDelay(MOCK_SUCCESS_RESPONSE) as any; // Cast a any
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
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'admin' }) as any; // Cast a any
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
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'agent' }) as any; // Cast a any
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
    return mockDelay(MOCK_SUCCESS_RESPONSE) as any; // Cast a any
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
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `admin-mock-${Date.now()}` }) as any; // Cast a any
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
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `agent-mock-${Date.now()}` }) as any; // Cast a any
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
    return mockDelay(MOCK_AGENT_STATS) as any; // Cast a any
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
    return mockDelay(MOCK_PROPERTIES.slice(startIndex, endIndex)) as any; // Cast a any
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
export const searchProperties = async (searchParams: any): Promise<PropertyDetail[]> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] searchProperties:', searchParams);
    // Simula una ricerca semplice basata sul titolo, indirizzo o tipo nei mock
    const query = searchParams?.query?.toLowerCase() || '';
    const category = searchParams?.category?.toLowerCase() || ''; // Usa 'category' come parametro per il tipo
    const filtered = MOCK_PROPERTIES.filter(p =>
      (p.title.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)) &&
      (category === '' || p.type.toLowerCase() === category) // Filtra per tipo se 'category' è fornito
    );
    return mockDelay(filtered) as any; // Cast a any
  }
  const response = await httpClient.get(apiEndpoints.searchProperties, { params: searchParams });
  // Assumiamo che l'API restituisca direttamente PropertyDetail[] o che l'adattamento avvenga nel componente
  return response.data;
};

/**
 * Recupera gli immobili marcati come "in evidenza".
 * @returns La risposta dell'API con gli immobili in evidenza.
 */
export const getFeaturedProperties = async (): Promise<PropertyDetail[]> => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] getFeaturedProperties');
    return mockDelay(MOCK_FEATURED_PROPERTIES) as any; // Cast a any
  }
  const response = await httpClient.get(apiEndpoints.featuredProperties);
  // Assumiamo che l'API restituisca direttamente PropertyDetail[] o che l'adattamento avvenga nel componente
  return response.data;
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
    // Restituisce dettagli mock o un errore simulato se non trovato
    return mockDelay(foundProperty ? { ...foundProperty } : Promise.reject(new Error('Immobile mock non trovato'))) as any; // Cast a any
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
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `prop-mock-${Date.now()}` }) as any;
  }
  // La chiamata reale userà POST sull'endpoint base delle proprietà
  const response = await httpClient.post(apiEndpoints.createProperty, propertyData);
  return response.data;
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
  // Aggiungere qui altre funzioni API man mano che vengono implementate (es. favorites, visits)
};

export default ApiService;
