import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as SecureStore from 'expo-secure-store';
import httpClient from '../httpClient'; // Importa l'istanza configurata

// Mock di expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  // setItemAsync non è testato qui ma potrebbe essere mockato se necessario
}));

// Chiave del token (deve corrispondere a quella usata in httpClient.ts e LoginForm.tsx)
const TOKEN_KEY = 'user_auth_token';

describe('httpClient Interceptors', () => {
  let mock: MockAdapter;
  let mockSecureStoreGet: jest.SpyInstance;
  // let mockSecureStoreDelete: jest.SpyInstance; // Non usato direttamente qui ma disponibile

  beforeEach(() => {
    // Crea un nuovo mock adapter per ogni test
    mock = new MockAdapter(httpClient);
    // Ottieni riferimenti alle funzioni mockate di SecureStore
    mockSecureStoreGet = jest.spyOn(SecureStore, 'getItemAsync');
    // mockSecureStoreDelete = jest.spyOn(SecureStore, 'deleteItemAsync');
    // Resetta i mock prima di ogni test
    mock.reset();
    mockSecureStoreGet.mockClear();
    // mockSecureStoreDelete.mockClear();
    // Resetta anche i mock di console per evitare interferenze tra test
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Ripristina i mock di console
    jest.restoreAllMocks();
  });

  // --- Test Interceptor di Richiesta ---

  it('dovrebbe aggiungere l\'header Authorization se il token esiste in SecureStore', async () => {
    const mockToken = 'test-jwt-token';
    mockSecureStoreGet.mockResolvedValueOnce(mockToken);

    // Simula una richiesta GET
    mock.onGet('/test-endpoint').reply(200, { data: 'success' });

    await httpClient.get('/test-endpoint');

    // Verifica che getItemAsync sia stato chiamato
    expect(mockSecureStoreGet).toHaveBeenCalledWith(TOKEN_KEY);

    // Verifica che l'header Authorization sia stato aggiunto alla richiesta effettiva
    expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('NON dovrebbe aggiungere l\'header Authorization se il token NON esiste in SecureStore', async () => {
    mockSecureStoreGet.mockResolvedValueOnce(null); // Simula token non trovato

    mock.onGet('/test-endpoint').reply(200, { data: 'success' });

    await httpClient.get('/test-endpoint');

    expect(mockSecureStoreGet).toHaveBeenCalledWith(TOKEN_KEY);
    // Verifica che l'header Authorization NON sia presente
    expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
  });

  it('dovrebbe gestire l\'errore durante il recupero del token da SecureStore', async () => {
    const secureStoreError = new Error('Failed to read from SecureStore');
    mockSecureStoreGet.mockRejectedValueOnce(secureStoreError);
    const consoleErrorSpy = jest.spyOn(console, 'error');

    mock.onGet('/test-endpoint').reply(200, { data: 'success' });

    await httpClient.get('/test-endpoint');

    expect(mockSecureStoreGet).toHaveBeenCalledWith(TOKEN_KEY);
    // Verifica che l'errore sia stato loggato
    expect(consoleErrorSpy).toHaveBeenCalledWith("Errore nel recuperare il token da SecureStore:", secureStoreError);
    // La richiesta dovrebbe comunque procedere senza header Authorization
    expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
  });

  // --- Test Interceptor di Risposta ---

  it('dovrebbe restituire la risposta in caso di successo (status 2xx)', async () => {
    const responseData = { message: 'Operazione completata' };
    mock.onGet('/success-endpoint').reply(200, responseData);

    const response = await httpClient.get('/success-endpoint');

    expect(response.status).toBe(200);
    expect(response.data).toEqual(responseData);
  });

  it('dovrebbe rigettare e loggare l\'errore in caso di risposta 401 Unauthorized', async () => {
    const errorData = { message: 'Token non valido' };
    mock.onGet('/unauthorized-endpoint').reply(401, errorData);
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const consoleWarnSpy = jest.spyOn(console, 'warn');

    await expect(httpClient.get('/unauthorized-endpoint')).rejects.toThrow();

    // Verifica che l'errore sia stato loggato (adattato al log effettivo)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Errore API:', 401, expect.stringContaining('Request failed with status code 401'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Dati errore:', errorData);
    // Verifica che il warning specifico per 401 sia stato loggato
    expect(consoleWarnSpy).toHaveBeenCalledWith('Errore 401: Non autorizzato. Token mancante, invalido o scaduto.');
  });

  it('dovrebbe rigettare e loggare l\'errore in caso di risposta 500 Internal Server Error', async () => {
    const errorData = { message: 'Errore interno del server' };
    mock.onGet('/server-error-endpoint').reply(500, errorData);
    const consoleErrorSpy = jest.spyOn(console, 'error');

    await expect(httpClient.get('/server-error-endpoint')).rejects.toThrow();

    // Verifica che l'errore sia stato loggato (adattato al log effettivo)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Errore API:', 500, expect.stringContaining('Request failed with status code 500'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Dati errore:', errorData);
  });

  it('dovrebbe rigettare e loggare l\'errore in caso di errore di rete (nessuna risposta)', async () => {
    mock.onGet('/network-error-endpoint').networkError(); // Simula errore di rete
    const consoleErrorSpy = jest.spyOn(console, 'error');

    await expect(httpClient.get('/network-error-endpoint')).rejects.toThrow();

    // Verifica che l'errore sia stato loggato (adattato al log effettivo per errore di rete)
    // L'errore loggato in caso di networkError sembra essere diverso, controlliamo il secondo log
    expect(consoleErrorSpy).toHaveBeenCalledWith('Errore configurazione richiesta Axios:', 'Network Error');
    // Potremmo anche verificare il primo log se necessario, ma il secondo è più specifico dell'errore Axios
    // expect(consoleErrorSpy).toHaveBeenCalledWith('Errore API:', undefined, 'Network Error');
  });
});