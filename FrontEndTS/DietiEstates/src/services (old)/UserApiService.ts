import httpClient from '../../../app/_services/httpClient';
import { UserCreationDTO } from '../dto/UserCreationDTO';
// Definisce i path relativi degli endpoint API per la gestione degli utenti
const userEndpoints = {
  agentProfile: '/agent/info',
  adminCreate: '/admins/create-admin',
  agentCreate: '/agent/create-estate-agent-account',
  users: '/users',
} as const;

/**
 * Recupera il profilo dell'agente loggato.
 * @returns La risposta dell'API con i dati del profilo.
 */
export const getAgentProfile = async () => {
  console.log('[UserApiService] getAgentProfile');
  const response = await httpClient.get(userEndpoints.agentProfile);
  return response.data;
};

/**
 * Crea un nuovo account amministratore.
 * @param adminData - Dati del nuovo amministratore.
 * @returns La risposta dell'API.
 */
export const createAdmin = async (adminData: UserCreationDTO): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[UserApiService] createAdmin:', adminData);
  const response = await httpClient.post(userEndpoints.adminCreate, adminData);
  return response.data;
};

/**
 * Crea un nuovo account agente immobiliare.
 * @param agentData - Dati del nuovo agente.
 * @returns La risposta dell'API.
 */
export const createAgent = async (agentData: UserCreationDTO): Promise<{ success: boolean; message?: string; id?: string | number }> => {
  console.log('[UserApiService] createAgent:', agentData);
  const response = await httpClient.post(userEndpoints.agentCreate, agentData);
  return response.data;
};

export const getAllUsers = async (): Promise<any[]> => {
  console.log('[UserApiService] getAllUsers');
  const response = await httpClient.get(userEndpoints.users);
  return response.data;
};

export const getUserById = async (id: string): Promise<any> => {
  console.log('[UserApiService] getUserById:', id);
  const response = await httpClient.get(`${userEndpoints.users}/${id}`);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  console.log('[UserApiService] deleteUser:', id);
  await httpClient.delete(`${userEndpoints.users}/${id}`);
};

export default {
  getAgentProfile,
  createAdmin,
  createAgent,
  getAllUsers,
  getUserById,
  deleteUser,
};