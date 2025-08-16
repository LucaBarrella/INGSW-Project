import httpClient from '../../../app/_services/httpClient';
import { UserCreationData } from '../../presentation/hooks/useUserViewModel';
import { mockDelay, MOCK_SUCCESS_RESPONSE, MOCK_AGENT_PROFILE } from '../../../app/_services/__mocks__/mockData';

// Definisce i path relativi degli endpoint API per la gestione degli utenti
const userEndpoints = {
  agentProfile: '/agent/info',
  adminCreate: '/admins/create-admin',
  agentCreate: '/agent/create-estate-agent-account',
} as const;

/**
 * Recupera il profilo dell'agente loggato.
 * @returns La risposta dell'API con i dati del profilo.
 */
export const getAgentProfile = async () => {
  console.log('[UserApiService] getAgentProfile');
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay(MOCK_AGENT_PROFILE);
  }
  const response = await httpClient.get(userEndpoints.agentProfile);
  return response.data;
};

/**
 * Crea un nuovo account amministratore.
 * @param adminData - Dati del nuovo amministratore.
 * @returns La risposta dell'API.
 */
export const createAdmin = async (adminData: UserCreationData): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[UserApiService] createAdmin:', adminData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `admin-mock-${Date.now()}` });
  }
  const response = await httpClient.post(userEndpoints.adminCreate, adminData);
  return response.data;
};

/**
 * Crea un nuovo account agente immobiliare.
 * @param agentData - Dati del nuovo agente.
 * @returns La risposta dell'API.
 */
export const createAgent = async (agentData: UserCreationData): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[UserApiService] createAgent:', agentData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_SUCCESS_RESPONSE, id: `agent-mock-${Date.now()}` });
  }
  const response = await httpClient.post(userEndpoints.agentCreate, agentData);
  return response.data;
};

export default {
  getAgentProfile,
  createAdmin,
  createAgent,
};