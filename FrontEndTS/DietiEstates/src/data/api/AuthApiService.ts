import httpClient from '../../../app/_services/httpClient';
import { LoginCredentials } from '../../../types/UserCredentials';
import { ApiResponseToken } from './ResponseTokenService';
import { mockDelay, MOCK_TOKEN_RESPONSE } from '../../../app/_services/__mocks__/mockData';

// Definisce i path relativi degli endpoint API per l'autenticazione
const authEndpoints = {
  buyerLogin: '/login',
  buyerRegister: '/signup',
  adminLogin: '/admins/login',
  agentLogin: '/estates_agents/login',
  logout: '/logout',
  refresh: '/refresh',
  adminChangePassword: '/admins/change-amministration-password',
} as const;

/**
 * Esegue il login per un utente (acquirente).
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  // Il flag USE_MOCK_API è gestito internamente da httpClient
  console.log('[AuthApiService] loginUser:', credentials);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'buyer', accessToken: 'mock-access-token-buyer' });
  }
  const response = await httpClient.post(authEndpoints.buyerLogin, credentials);
  return response.data;
};

/**
 * Registra un nuovo utente (acquirente).
 * @param userData - Dati dell'utente da registrare.
 * @returns La risposta dell'API.
 */
export const registerUser = async (userData: { email: string; password?: string; name?: string }): Promise<ApiResponseToken> => {
  console.log('[AuthApiService] registerUser:', userData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'buyer', accessToken: 'mock-access-token-buyer' });
  }
  const response = await httpClient.post(authEndpoints.buyerRegister, userData);
  return response.data;
};

/**
 * Esegue il login per un amministratore.
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginAdmin = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  console.log('[AuthApiService] loginAdmin:', credentials);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'admin', accessToken: 'mock-access-token-admin' });
  }
  const response = await httpClient.post(authEndpoints.adminLogin, credentials);
  return response.data;
};

/**
 * Esegue il login per un agente immobiliare.
 * @param credentials - Oggetto con email e password.
 * @returns La risposta dell'API (es. contenente il token).
 */
export const loginAgent = async (credentials: LoginCredentials): Promise<ApiResponseToken> => {
  console.log('[AuthApiService] loginAgent:', credentials);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ ...MOCK_TOKEN_RESPONSE, userType: 'agent', accessToken: 'mock-access-token-agent' });
  }
  const response = await httpClient.post(authEndpoints.agentLogin, credentials);
  return response.data;
};

/**
 * Cambia la password di un amministratore.
 * @param passwordData - Dati per il cambio password.
 * @returns La risposta dell'API.
 */
export const changeAdminPassword = async (passwordData: { oldPassword: string; newPassword: string }): Promise<{ success: boolean; message?: string }> => {
  console.log('[AuthApiService] changeAdminPassword:', passwordData);
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Password changed successfully' });
  }
  const response = await httpClient.post(authEndpoints.adminChangePassword, passwordData);
  return response.data;
};

/**
 * Esegue il logout dell'utente invalidando il token sul server.
 * @returns La risposta dell'API.
 */
export const logout = async (refreshToken: string): Promise<{ success: boolean; message?: string }> => {
  console.log('[AuthApiService] logout');
  if (process.env.NODE_ENV === 'test' || (httpClient as any).USE_MOCK_API_HTTP) {
    return mockDelay({ success: true, message: 'Logout successful' });
  }
  try {
    const response = await httpClient.post(authEndpoints.logout, { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Errore durante il logout API:', error);
    throw error; // Rilancia l'errore per essere gestito a monte
  }
};

export default {
  loginUser,
  registerUser,
  loginAdmin,
  loginAgent,
  changeAdminPassword,
  logout,
};