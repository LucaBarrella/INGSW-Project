export interface ITokenService {
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  removeToken(): Promise<void>;

  saveRefreshToken(token: string): Promise<void>;
  getRefreshToken(): Promise<string | null>;
  removeRefreshToken(): Promise<void>;
}