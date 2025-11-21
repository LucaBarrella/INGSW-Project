import { ITokenProvider } from './ITokenProvider';

let provider: ITokenProvider | null = null;

/**
 * Registra un provider concreto che implementa ITokenProvider.
 * Deve essere invocato dal compositionRoot all'avvio dell'app.
 */
export const setTokenProvider = (p: ITokenProvider) => {
  provider = p;
};

export const clearTokenProvider = () => {
  provider = null;
};

export const getToken = async (): Promise<string | null> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: getToken restituisce null');
    return null;
  }
  return provider.getToken();
};

export const getRefreshToken = async (): Promise<string | null> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: getRefreshToken restituisce null');
    return null;
  }
  return provider.getRefreshToken();
};

export const saveToken = async (token: string): Promise<void> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: saveToken no-op');
    return;
  }
  return provider.saveToken(token);
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: saveRefreshToken no-op');
    return;
  }
  return provider.saveRefreshToken(token);
};

export const removeToken = async (): Promise<void> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: removeToken no-op');
    return;
  }
  return provider.removeToken();
};

export const removeRefreshToken = async (): Promise<void> => {
  if (!provider) {
    console.warn('TokenProvider non impostato: removeRefreshToken no-op');
    return;
  }
  return provider.removeRefreshToken();
};

export default {
  setTokenProvider,
  clearTokenProvider,
  getToken,
  getRefreshToken,
  saveToken,
  saveRefreshToken,
  removeToken,
  removeRefreshToken,
};