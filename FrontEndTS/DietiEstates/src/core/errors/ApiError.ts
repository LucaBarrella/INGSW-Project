class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Create an ApiError from a received error (e.g. AxiosError).
   * - Extracts status, a user-friendly message and preserves original payload in `details`.
   *
   * @param err Original error (Error, AxiosError, or anything)
   * @param statusCode Optional HTTP status override
   * @param userMessage Optional friendly message to expose to the user
   */
  static from(err: unknown, statusCode?: number, userMessage?: string): ApiError {
    const extractedStatus =
      statusCode ??
      // support common shapes: explicit statusCode (our ApiError), axios response.status, generic status
      (err && typeof err === 'object' && (err as any).statusCode) ??
      (err && typeof err === 'object' && (err as any).response?.status) ??
      (err && typeof err === 'object' && (err as any).status) ??
      0;

    // preserve useful original payload (if present)
    console.log('ApiError.from - extracting details from error:', JSON.stringify(err));
    console.log(JSON.stringify((err as any)?.response));
    const details =
      err && typeof err === 'object'
        ? (err as any).response?.data ?? (err as any)
        : undefined;

    // prefer caller-provided friendly message
    if (userMessage && typeof userMessage === 'string') {
      return new ApiError(extractedStatus, userMessage, details);
    }

    let originalMessage: string;
    if (err instanceof Error) {
      originalMessage = err.message;
    } else if (err && typeof err === 'object') {
      try {
        originalMessage =
          (err as any).response?.data?.message ??
          (err as any).message ??
          JSON.stringify((err as any).response?.data ?? err);
      } catch {
        originalMessage = String(err);
      }
    } else {
      originalMessage = String(err);
    }

    return new ApiError(extractedStatus, originalMessage, details);
  }
}

export default ApiError;