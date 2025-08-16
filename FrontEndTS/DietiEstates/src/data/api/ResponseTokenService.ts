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
  userType?: 'buyer' | 'admin' | 'agent';
}