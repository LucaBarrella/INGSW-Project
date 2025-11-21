export interface ITokenProvider {
  getToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  saveToken(token: string): Promise<void>;
  saveRefreshToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
  removeRefreshToken(): Promise<void>;
}