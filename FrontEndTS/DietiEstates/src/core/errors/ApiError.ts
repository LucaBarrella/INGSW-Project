 class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Crea un'istanza di ApiError a partire da un errore ricevuto (es. AxiosError)
   * - Restituisce solo dati tecnici (statusCode e message).
   *
   * @param err Errore originale (può essere Error, AxiosError, o altro)
   * @param statusCode Stato HTTP opzionale (override)
   */
  static from(err: unknown, statusCode?: number): ApiError {
    const extractedStatus =
      statusCode ??
      // support common shapes: explicit statusCode (our ApiError), axios response.status, generic status
      (err && typeof err === 'object' && (err as any).statusCode) ??
      (err && typeof err === 'object' && (err as any).response?.status) ??
      (err && typeof err === 'object' && (err as any).status) ??
      0;
 
    let originalMessage: string;
    if (err instanceof Error) {
      originalMessage = err.message;
    } else if (err && typeof err === 'object') {
      try {
        originalMessage =
          (err as any).response?.data?.message ??
          (err as any).message ??
          JSON.stringify(err);
      } catch {
        originalMessage = String(err);
      }
    } else {
      originalMessage = String(err);
    }
 
    return new ApiError(extractedStatus, originalMessage);
  }
}

export default ApiError;