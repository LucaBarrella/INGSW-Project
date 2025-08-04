import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
// Importa il flag MOCK (potrebbe causare dipendenza circolare, vedi nota sotto)
// import { USE_MOCK_API } from './api.service'; // <-- ATTENZIONE: Possibile dipendenza circolare

// --- FLAG PER ABILITARE/DISABILITARE LE API MOCK ---
// Duplichiamo il flag qui per evitare dipendenze circolari.
// Assicurati che questo valore sia SINCRONIZZATO con quello in api.service.ts
const USE_MOCK_API_HTTP = false;

// Chiave per salvare/recuperare il token JWT da SecureStore
const TOKEN_KEY = 'user_auth_token';

// Determina l'URL base dell'API in base all'ambiente
// Assicurati che le variabili API_BASE_URL_DEV e API_BASE_URL_PROD
// siano definite nella sezione 'extra' del tuo file app.json o app.config.js
// Esempio app.json:
// {
//   "expo": {
//     ...
//     "extra": {
//       "API_BASE_URL_DEV": "http://localhost:8080/api",
//       "API_BASE_URL_PROD": "https://your-production-api-url.azurewebsites.net/api",
//       "eas": {
//         "projectId": "YOUR_EAS_PROJECT_ID"
//       }
//     }
//   }
// }
// const baseURL = __DEV__
//   ? Constants.expoConfig?.extra?.API_BASE_URL_DEV
//   : Constants.expoConfig?.extra?.API_BASE_URL_PROD;

// Fallback temporaneo se le variabili non sono in app.json/extra
// TODO: Rimuovere questo fallback e configurare correttamente app.json/extra
const baseURL = __DEV__
  ? 'http://localhost:8080' // Usa l'URL DEV da .env, TODO usa localhost per emulatori iOS e IP locale per dispositivi fisici
  : 'https://your-production-api-url.azurewebsites.net/api'; // Usa l'URL PROD da .env (DA AGGIORNARE!)

if (!baseURL && !USE_MOCK_API_HTTP) { // Controlla baseURL solo se non siamo in mock http
  console.error(
    'ERRORE: URL base API non configurato! Assicurati che API_BASE_URL_DEV/PROD siano in app.json (extra) o rimuovi il fallback in httpClient.ts'
  );
}

const httpClient: AxiosInstance = (() => {
  if (USE_MOCK_API_HTTP) {
    // Se MOCK è attivo, crea un oggetto mock che simula Axios
    console.log('[httpClient] Modalità MOCK ATTIVA. Nessuna chiamata di rete verrà effettuata da httpClient.');
    return {
    // Simula i metodi Axios usati (get, post, etc.)
    // Simula i metodi Axios usati (get, post, etc.)
    // Queste funzioni mock non verranno MAI chiamate se api.service.ts funziona correttamente,
    // ma servono come fallback e per evitare errori di tipo.
    get: (url: string, _config?: any) => {
      console.warn(`[httpClient MOCK] Tentativo di GET a ${url} bloccato.`);
      return Promise.reject(new Error(`[httpClient MOCK] Chiamata GET a ${url} bloccata in modalità mock.`));
    },
    post: (url: string, _data?: any, _config?: any) => {
      console.warn(`[httpClient MOCK] Tentativo di POST a ${url} bloccato.`);
      return Promise.reject(new Error(`[httpClient MOCK] Chiamata POST a ${url} bloccata in modalità mock.`));
    },
    put: (url: string, _data?: any, _config?: any) => {
      console.warn(`[httpClient MOCK] Tentativo di PUT a ${url} bloccato.`);
      return Promise.reject(new Error(`[httpClient MOCK] Chiamata PUT a ${url} bloccata in modalità mock.`));
    },
    delete: (url: string, _config?: any) => {
      console.warn(`[httpClient MOCK] Tentativo di DELETE a ${url} bloccato.`);
      return Promise.reject(new Error(`[httpClient MOCK] Chiamata DELETE a ${url} bloccata in modalità mock.`));
    },
    // Aggiungi altri metodi se necessario (patch, head, options)
    // Fornisci implementazioni mock minime per le proprietà richieste da AxiosInstance
    defaults: { headers: {} } as any,
    interceptors: {
      request: { use: () => {}, eject: () => {} } as any, // Usa funzioni vuote
      response: { use: () => {}, eject: () => {} } as any,
    },
    getUri: (_config?: any) => '', // Funzione mock
    request: (_config: any) => Promise.reject(new Error('[httpClient MOCK] request bloccato')), // Funzione mock
    head: (_url: string, _config?: any) => Promise.reject(new Error('[httpClient MOCK] head bloccato')), // Funzione mock
    options: (_url: string, _config?: any) => Promise.reject(new Error('[httpClient MOCK] options bloccato')), // Funzione mock
    patch: (_url: string, _data?: any, _config?: any) => Promise.reject(new Error('[httpClient MOCK] patch bloccato')), // Funzione mock

  } as AxiosInstance; // Forza il tipo a AxiosInstance
} else {
  // Se MOCK è disattivo, crea l'istanza Axios reale
  console.log(`[httpClient] Modalità API Reale. Connessione a: ${baseURL}`);
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    });

    // Interceptor di Richiesta (solo per istanza reale)
    instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Errore nel recuperare il token da SecureStore:", error);
      }
      return config;
    },
    (error: AxiosError) => {
      console.error("Errore nell'interceptor di richiesta:", error);
      return Promise.reject(error);
    }
    );

    // Interceptor di Risposta (solo per istanza reale)
    instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error('Errore API:', error.response?.status, error.message);
      // ... (resto della gestione errori esistente) ...
       if (error.response) {
         // Il server ha risposto con uno status code fuori dal range 2xx
         console.error('Dati errore:', error.response.data);
         console.error('Header errore:', error.response.headers);

         if (error.response.status === 401) {
           console.warn('Errore 401: Non autorizzato. Token mancante, invalido o scaduto.');
           // TODO: Implementare logica di reindirizzamento al login o refresh token
         } else if (error.response.status === 403) {
           console.warn('Errore 403: Accesso negato.');
         }
       } else if (error.request) {
         console.error('Errore di rete o nessuna risposta dal server:', error.request);
       } else {
         console.error('Errore configurazione richiesta Axios:', error.message);
       }
      return Promise.reject(error);
    }
    );
    return instance;
  }
})(); // Immediately Invoked Function Expression (IIFE)

export default httpClient;