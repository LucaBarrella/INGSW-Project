// Interfaccia per la risposta del token API
export interface ApiResponseToken {
  success: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  message?: string;
  userId?: string | number;
  firstName?: string;
  lastName?: string;
  // Ruoli restituiti dal backend (opzionale, vettore di stringhe type-safe lato server)
  roles?: string[];
}