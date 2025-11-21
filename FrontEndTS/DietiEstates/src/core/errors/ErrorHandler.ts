import ApiError from './ApiError';
 
/**
 * Gestore centrale degli errori API.
 * - Se viene passato userMessageOverride, viene restituito immediatamente (override totale).
 * - Altrimenti usa ApiError.fornisce status tecnico e costruisce un messaggio user-friendly centralizzato.
 * - Logga l'errore per il debug e restituisce la stringa da mostrare in UI.
 */
class ErrorHandler {
  static handle(err: unknown, userMessageOverride?: string): string {
    if (userMessageOverride) {
      console.warn('ErrorHandler override message used:', userMessageOverride, { originalError: err });
      return userMessageOverride;
    }
 
    const apiError = ApiError.from(err);
    const status = apiError.statusCode ?? 0;
 
    // Mappa centrale dei messaggi user-friendly
    // TODO Traddure con i18n
    const messagesByStatus: Record<number, string> = {
      0: 'Impossibile raggiungere il server. Controlla la connessione.',
      400: 'Richiesta non valida. Controlla i dati inseriti.',
      401: 'Credenziali non valide. Riprova.',
      403: 'Accesso negato. Non hai i permessi per questa operazione.',
      404: 'Risorsa non trovata.',
      409: "Conflitto. La risorsa esiste già o c'è un problema di stato.",
      500: 'Errore interno del server. Riprova più tardi.',
      503: 'Servizio non disponibile. Riprova più tardi.',
    };
 
    let userMessage = messagesByStatus[status];
    if (!userMessage) {
      if (status >= 500) {
        userMessage = messagesByStatus[500];
      } else {
        userMessage = `Si è verificato un errore: ${status}.`;
      }
    }
 
    console.warn('ErrorHandler handled error:', { status, userMessage, original: apiError.message });
    return userMessage;
  }
}
 
export default ErrorHandler;