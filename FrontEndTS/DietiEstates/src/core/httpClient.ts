import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import ApiError from './errors/ApiError';
import { getToken, getRefreshToken, saveToken, saveRefreshToken } from './auth/TokenManager';

const baseURL = __DEV__
  ? 'https://thefabbest-dietiestates25.hf.space'
  : 'https://thefabbest-dietiestates25.hf.space';

if (!baseURL) {
  console.error('ERRORE: URL base API non configurato!');
}

console.log(`[httpClient] Modalità API Reale. Connessione a: ${baseURL}`);
const httpClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Errore nel recuperare il token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Errore nella interceptor di richiesta:', error);
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    let userMessage = 'Si è verificato un errore inatteso.';
    let statusCode = error.response?.status || 0;

    if (error.response) {
      console.log(statusCode);

      switch (statusCode) {
        case 400:
          userMessage = 'Richiesta non valida. Controlla i dati inseriti.';
          break;
        case 401:
          userMessage = 'Credenziali non valide o sessione scaduta. Effettua nuovamente il login.';
          break;
        case 403:
          userMessage = 'Accesso negato. Non hai i permessi per questa operazione.';
          break;
        case 498:
          // Evitiamo loop: non tentare refresh se la richiesta originale era /auth/refresh
          if (!(error.config && error.config.url && error.config.url.endsWith('/refresh'))) {
            try {
              const refreshToken = await getRefreshToken();
              if (refreshToken) {
                const response = await httpClient.post('/auth/refresh', { refreshToken });
                const newToken = response.data;
                await saveToken(newToken.accessToken);
                await saveRefreshToken(newToken.refreshToken);
                return httpClient.request(error.config!);
              }
            } catch (refreshError) {
              console.error('Errore durante il refresh del token:', refreshError);
            }
          }
          break;
        case 404:
          userMessage = 'Risorsa non trovata.';
          break;
        case 409:
          userMessage = 'Conflitto. La risorsa esiste già o c\'è un problema di stato.';
          break;
        case 500:
          userMessage = 'Errore interno del server. Riprova più tardi.';
          break;
        case 503:
          userMessage = 'Servizio non disponibile. Riprova più tardi.';
          break;
        default:
          userMessage = `Si è verificato un errore: ${statusCode}.`;
      }
    } else if (error.request) {
      userMessage = 'Nessuna risposta dal server. Controlla la tua connessione.';
      console.error('Errore di rete o nessuna risposta dal server:', error.request);
    } else {
      userMessage = 'Errore nella configurazione della richiesta.';
      console.error('Errore configurazione richiesta Axios:', error.message);
    }

    return Promise.reject(new ApiError(statusCode, error.message, userMessage));
  }
);

export default httpClient;