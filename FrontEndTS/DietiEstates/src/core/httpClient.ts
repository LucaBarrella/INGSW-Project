import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import ApiError from './errors/ApiError';
import { getToken, getRefreshToken, saveToken, saveRefreshToken } from './auth/TokenManager';

// Estendi l'interfaccia di configurazione di Axios per includere la proprietà personalizzata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
  }
}

// const BASE_URL = 'https://thefabbest-dietiestates25.hf.space'
const BASE_URL = 'https://ropesthrills-dietiestates25.hf.space';

// localhost per test con backend in esecuzione localmentedasdadsadadsa
// const BASE_URL = 'http://localhost:8080/';
      
const TIMEOUT = 10000;

if (!BASE_URL) {
  console.error('ERRORE: URL base API non configurato!');
}

const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const enqueueFailedRequest = (): Promise<string> =>
  new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));

const processFailedQueue = (error: any | null, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const setAuthHeader = (headers: any, token: string | undefined) => {
  if (!headers) return;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  else delete headers['Authorization'];
};

const mapStatusToMessage = (status: number): string => {
  switch (status) {
    case 400: return 'Richiesta non valida. Controlla i dati inseriti.';
    case 401: return 'Sessione scaduta. Effettua nuovamente il login.';
    case 403: return 'Accesso negato. Non hai i permessi per questa operazione.';
    case 404: return 'Risorsa non trovata.';
    case 409: return 'Conflitto. La risorsa esiste già o c\'è un problema di stato.';
    case 500: return 'Errore interno del server. Riprova più tardi.';
    case 503: return 'Servizio non disponibile. Riprova più tardi.';
    default: return `Si è verificato un errore: ${status}.`;
  }
};

// Request interceptor: aggiunge Authorization se presente
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await getToken();
      config.headers = config.headers ?? {};
      setAuthHeader(config.headers, token ?? undefined);
    } catch (e) {
      console.error('Errore nel recupero del token:', e);
    }
    console.log(`[httpClient] Richiesta in uscita: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('[httpClient] Headers:', config.headers);
    if (config.data) {
        console.log('[httpClient] Payload:', JSON.stringify(config.data, null, 2));
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[httpClient] Errore intercettore richiesta:', error);
    return Promise.reject(error);
  }
);

// Refresh flow: gestisce il rinnovo token e la riesecuzione delle richieste in coda
const performRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  originalRequest._isRetry = true;
  isRefreshing = true;

  try {
    const refreshToken = await getRefreshToken();
    console.log('[httpClient] Tentativo di refresh token con:', refreshToken ? 'token presente' : 'token assente');
    if (!refreshToken) {
      throw new ApiError(401, 'Sessione scaduta. Effettua nuovamente il login.');
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
    const newToken = response.data;

    await saveToken(newToken.accessToken);
    await saveRefreshToken(newToken.refreshToken);

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${newToken.accessToken}`;
    if (originalRequest.headers) {
      originalRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
    }

    processFailedQueue(null, newToken.accessToken);
    return httpClient(originalRequest);
  } catch (err) {
    processFailedQueue(err, undefined);
    throw new ApiError(401, 'Sessione scaduta. Effettua nuovamente il login.');
  } finally {
    isRefreshing = false;
  }
};

// Response interceptor: gestisce errori e refresh token
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (axios.isCancel(error) || error.name === 'CanceledError' || error.message === 'canceled') {
      return Promise.reject(error);
    }

    const statusCode = error.response?.status ?? 0;
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (error.response) {
      // Rinnova token su 401/403 (backend usa 403 per token scaduti)
      if ((statusCode === 401 || statusCode === 403) && originalRequest && !originalRequest._isRetry) {
        if (isRefreshing) {
          try {
            const token = await enqueueFailedRequest();
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          } catch (e) {
            return Promise.reject(e);
          }
        }
        return performRefresh(originalRequest);
      }

      console.error(`[httpClient] Errore risposta API (Status: ${statusCode}):`, error.response.data);
      const userMessage = mapStatusToMessage(statusCode);
      return Promise.reject(new ApiError(statusCode, userMessage));
    } else if (error.request) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      console.error(`[httpClient] Errore di rete o nessuna risposta dal server (Timeout: ${isTimeout}):`, {
        code: error.code,
        message: error.message,
        url: error.config?.url
      });
      return Promise.reject(new ApiError(0, isTimeout ? 'Il server ha impiegato troppo tempo a rispondere. Riprova.' : 'Nessuna risposta dal server. Controlla la tua connessione.'));
    } else {
      console.error('[httpClient] Errore configurazione richiesta Axios:', error.message);
      return Promise.reject(new ApiError(0, 'Errore nella configurazione della richiesta.'));
    }
  }
);

export default httpClient;
