export interface UserCredentials {
  email: string;
  password: string; // Changed to required
  name?: string;
  username?: string;
  surname?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}